import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contribution from '@/modals/Contribution';
import { ObjectId } from 'mongodb';
import Event from '@/modals/Event';

export async function GET(request, { params }) {
  await dbConnect();
  const userId = params.userId;

  try {
    const receivedContributions = await Event.aggregate([
      { $match: { host: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'contributions',
          localField: '_id',
          foreignField: 'event',
          as: 'contributions'
        }
      },
      {
        $unwind: '$contributions'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'contributions.contributor',
          foreignField: '_id',
          as: 'contributorData'
        }
      },
      {
        $unwind: '$contributorData'
      },
      {
        $group: {
          _id: '$_id',
          eventName: { $first: '$name' },
          totalAmount: { $sum: '$contributions.amount' },
          contributions: {
            $push: {
              contributorName: '$contributorData.name',
              amount: '$contributions.amount'
            }
          }
        }
      }
    ]);

    // Fetch contributed gifts (contributions made by the user)
    const contributedGifts = await Contribution.aggregate([
      { $match: { contributor: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'eventData.host',
          foreignField: '_id',
          as: 'hostData'
        }
      },
      {
        $unwind: '$hostData'
      },
      {
        $project: {
          _id: 1,
          eventName: '$eventData.name',
          hostName: '$hostData.name',
          amount: 1
        }
      }
    ]);

    return NextResponse.json({ receivedContributions, contributedGifts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}