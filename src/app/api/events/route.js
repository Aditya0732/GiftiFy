import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/User';
import Event from '@/modals/Event';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EventInvitation from '@/emails/EventInvitation';
import Contribution from '@/modals/Contribution';

const resend = new Resend(process.env.RESEND_APIKEY);

export async function POST(req) {
  try {
    const { name, date, venue, host, guests } = await req.json();

    await dbConnect();

    const hostUser = await User.findById(host);
    if (!hostUser) {
      return NextResponse.json({ message: 'Host user not found' }, { status: 400 });
    }

    const guestUsers = await Promise.all(guests.map(async (guest) => {
      let user = await User.findOne({ $or: [{ email: guest.email }, { phone: guest.phone }] });
      if (!user) {
        user = new User({...guest, registered: false});
        await user.save();
      } 
      return user;
    }));
    console.log("hello there",guestUsers);

    const newEvent = new Event({
      name,
      date,
      venue,
      host,
      guests: guestUsers.map(user => user._id),
      status: 'open',
    });

    await newEvent.save();

    for (const guest of guestUsers) {
      const emailHtml = render(
        <EventInvitation
          eventName={name}
          eventDate={date}
          eventVenue={venue}
          recipientName={guest.name}
          isRegistered={guest.registered}
          registrationUrl="http://localhost:3000"
        />
      );
      console.log("mail:",guest.email);
      const response = await resend.emails.send({
        from: 'Giftify <onboarding@resend.dev>',
        to: guest.email,
        subject: `You're invited to ${name}! 🎉`,
        html: emailHtml,
      });
      console.log("resend response",response);
    }

    return NextResponse.json({ message: 'Event created successfully and invitations sent', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event or sending invitations:', error);
    return NextResponse.json({ message: 'Error creating event or sending invitations' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const events = await Event.find({
      $or: [
        { host: userId },
        { guests: userId }
      ]
    })
      .populate('host', 'name email phone city')
      .populate('guests', 'name email phone city')
      .lean();

    const eventsWithContributions = await Promise.all(events.map(async (event) => {
      const contributions = await Contribution.find({ event: event._id })
        .populate('contributor', 'name email phone city')
        .lean();

      return {
        ...event,
        contributions,
      };
    }));

    return NextResponse.json(eventsWithContributions);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
  }
}