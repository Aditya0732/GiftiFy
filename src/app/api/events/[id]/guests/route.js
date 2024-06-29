import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/User';
import Event from '@/modals/Event';
import Contribution from '@/modals/Contribution';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'No event Id provided!' }, { status: 422 });
    }
    
    await dbConnect();

    const event = await Event.findById(id).populate('guests');
    const guestIds = event.guests.map(guest => new mongoose.Types.ObjectId(guest._id));

    const guestsWithContributions = await User.aggregate([
      { $match: { _id: { $in: guestIds } } },
      {
        $lookup: {
          from: 'contributions',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contributor', '$$userId'] },
                    { $eq: ['$event', new mongoose.Types.ObjectId(id)] }
                  ]
                }
              }
            }
          ],
          as: 'contributions'
        }
      },
      {
        $addFields: {
          totalContribution: { $sum: '$contributions.amount' }
        }
      }
    ]);

    return NextResponse.json(guestsWithContributions);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ message: 'Error fetching guests' }, { status: 500 });
  }
}