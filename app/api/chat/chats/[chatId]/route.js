import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const { chatId } = resolvedParams;
        
        if (!chatId) {
            return NextResponse.json(
                { message: 'Chat ID is required', success: false, statusCode: 400 },
                { status: 400 }
            );
        }

        // Return a mock chat object
        const chat = {
            _id: chatId,
            participants: [
                { _id: 'user_1', username: 'You', email: 'demo@example.com' },
                { _id: 'user_2', username: 'Chat Partner', email: 'partner@example.com' }
            ],
            isGroupChat: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastMessage: null,
            name: null
        };

        return NextResponse.json(
            {
                statusCode: 200,
                data: chat,
                message: 'Chat fetched successfully',
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
