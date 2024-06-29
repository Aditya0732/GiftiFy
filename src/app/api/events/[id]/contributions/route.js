import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/User';
import Event from '@/modals/Event';
import Contribution from '@/modals/Contribution';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const { guestId, amount } = await req.json();

        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = session.user.id;

        const event = await Event.findById(id).populate('guests');
        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        const isHost = event.host.toString() === currentUserId;
        const isGuestAddingOwnContribution = currentUserId === guestId;

        if (!isHost && !isGuestAddingOwnContribution) {
            return NextResponse.json({ message: 'Unauthorized to add this contribution' }, { status: 403 });
        }

        const isValidGuest = event.guests.some(guest => guest._id.toString() === guestId);
        if (!isValidGuest) {
            return NextResponse.json({ message: 'Invalid guest for this event' }, { status: 400 });
        }

        const contribution = new Contribution({
            event: id,
            contributor: guestId,
            amount,
        });
        await contribution.save();

        await Event.findByIdAndUpdate(id, {
            $addToSet: { contributions: contribution._id },
        });

        return NextResponse.json({ message: 'Contribution added successfully', contribution }, { status: 201 });
    } catch (error) {
        console.error('Error adding contribution:', error);
        return NextResponse.json({ message: 'Error adding contribution' }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    try {
        const { id } = params;

        await dbConnect();

        const contributions = await Contribution.find({ event: id }).populate('contributor', 'name email phone city');

        return NextResponse.json(contributions);
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return NextResponse.json({ message: 'Error fetching contributions' }, { status: 500 });
    }
}