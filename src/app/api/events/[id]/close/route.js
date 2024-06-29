import dbConnect from "@/lib/mongodb";
import Event from "@/modals/Event";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
      const { id } = params;
  
      await dbConnect();
  
      const updatedEvent = await Event.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
  
      if (!updatedEvent) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Event closed successfully', event: updatedEvent });
    } catch (error) {
      console.error('Error closing event:', error);
      return NextResponse.json({ message: 'Error closing event' }, { status: 500 });
    }
  }