import mongoose, { Schema, Document } from "mongoose";

// Enum for message roles
export enum MessageRole {
    USER = "user",
    AGENT = "agent"
}

// Message interface
interface Message {
    timeString: string;
    role: MessageRole;
    message: string;
}

// ChatDocument interface
interface ChatDocument extends Document {
    chatThreadId: string;
    assetId: string;
    startedAt: Date;
    messages: Message[];
}

// Message schema
const MessageSchema = new Schema<Message>({
    timeString: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(MessageRole) },
    message: { type: String, required: true }
});

// Chat schema
const ChatSchema = new Schema<ChatDocument>({
    chatThreadId: { type: String, required: true, unique: true },
    assetId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    messages: { type: [MessageSchema], default: [] }
});

export const Chat = mongoose.model<ChatDocument>("Chat", ChatSchema);
