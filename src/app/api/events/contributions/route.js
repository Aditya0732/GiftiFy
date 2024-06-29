import dbConnect from '@/lib/mongodb';
import Contribution from '@/modals/Contribution';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const contributions = await Contribution.find()
      .populate({
        path: 'event',
        populate: {
          path: 'host',
          select: 'name'
        },
        select: 'name host'
      })
      .populate('contributor', 'name')
      .lean();

    return NextResponse.json(contributions);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}