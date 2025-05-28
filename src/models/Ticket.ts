// STORED IN MongoDB
import { Schema, model, Document } from 'mongoose';
export interface IComment{
  text: string;
  date: Date;
}

export interface ITicket extends Document {
  username: string;
  message: string;
  createdAt: Date;
  comments: IComment[];
  status: 'open' | 'closed' | 'pending';
}

const CommentSchema = new Schema<IComment>({
  text:   { type: String, required: true },
  date:   { type: Date,   required: true },
});

const ticketSchema = new Schema<ITicket>({
  username: { type: String, required: true },
  message: { type: String, required: true },
  comments: {type: [CommentSchema], default: []},
  status: {
    type: String,
    enum: ['open', 'closed', 'pending'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

export const Ticket = model<ITicket>('Ticket', ticketSchema);
