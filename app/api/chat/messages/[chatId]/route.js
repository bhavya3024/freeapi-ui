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

        return NextResponse.json(
            {
                statusCode: 200,
                data: [],
                message: 'Messages fetched successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { statusCode: 500, message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const { chatId } = resolvedParams;
        
        if (!chatId) {
            return NextResponse.json(
                { message: 'Chat ID is required', statusCode: 400, success: false },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const content = formData.get('content');

        if (!content) {
            return NextResponse.json(
                { message: 'Message content is required', statusCode: 400, success: false },
                { status: 400 }
            );
        }

        const message = {
            _id: `msg_${Date.now()}`,
            content,
            sender: { _id: 'user_1', username: 'You' },
            chatId,
            createdAt: new Date().toISOString(),
            attachments: []
        };

        return NextResponse.json(
            { statusCode: 200, data: message, message: 'Message sent', success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { statusCode: 500, message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
