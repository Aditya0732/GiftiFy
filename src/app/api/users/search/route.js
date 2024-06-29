import { NextResponse } from 'next/server';
import User from '@/modals/User';
import dbConnect from '@/lib/mongodb';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term');

    if (!term) {
      return NextResponse.json({ message: 'Search term is required' }, { status: 400 });
    }

    const users = await User.find({
      $or: [
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } }
      ]
    }).select('name email phone city');

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Error searching users' }, { status: 500 });
  }
}