import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Contribution from '@/modals/Contribution';
import Event from '@/modals/Event';
import dbConnect from '@/lib/mongodb';
// import dbConnect from '@/lib/dbConnect'; 

export async function GET(request, { params }) {
  try {
    await dbConnect(); 

    const { userId } = params;

    const contributions = await Contribution.aggregate([
      { $match: { contributor: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$event',
          totalContribution: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      {
        $unwind: '$eventDetails'
      },
      {
        $project: {
          event: '$eventDetails',
          totalContribution: 1,
          _id: 0
        }
      }
    ]);

    return NextResponse.json(contributions);
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}