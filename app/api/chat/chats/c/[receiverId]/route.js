import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request, { params }) {
    try {
        // Ensure params is awaited if it's a Promise
        const resolvedParams = await Promise.resolve(params);
        const { receiverId } = resolvedParams;
        
        if (!receiverId) {
            return NextResponse.json(
                { message: 'Receiver ID is required', success: false, statusCode: 400 },
                { status: 400 }
            );
        }

        // Create a simple chat object (in production, this would be stored in a database)
        const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const chat = {
            _id: chatId,
            participants: [
                { _id: 'current_user', username: 'You' },
                { _id: receiverId, username: 'Chat Partner' }
            ],
            isGroupChat: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastMessage: null,
            messages: [],
            name: null
        };

        return NextResponse.json(
            {
                statusCode: 200,
                data: chat,
                message: 'Chat created successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { 
                statusCode: 500,
                message: 'Internal server error', 
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}
