// STORED IN MongoDB
import { Schema, model, Document } from 'mongoose';

export interface ITicket extends Document {
  title: string;
  description: string;
  createdAt: Date;
  comments: [
    {
      text: String,
      date: Date,
    }
  ];
  status: 'open' | 'closed' | 'pending';
}

const ticketSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  comments: {},
  status: {
    type: String,
    enum: ['open', 'closed', 'pending'],
    default: 'open',
  },
  createdAt: { type: Date, default: () => new Date() },
});

export const Ticket = model<ITicket>('Ticket', ticketSchema);
