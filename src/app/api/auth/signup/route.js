import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/User';

export async function POST(request) {
  await dbConnect();

  const { name, email, password, phone, city } = await request.json();

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser && existingUser.registered === true) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    if (existingUser && existingUser.registered !== true) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.password = password;
      existingUser.phone = phone;
      existingUser.city = city;
      existingUser.registered = true;

      await existingUser.save();
      return NextResponse.json({ message: 'User updated and registered successfully' }, { status: 200 });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      city,
      registered: true
    });
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}