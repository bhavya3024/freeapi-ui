import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const BASE_URL = 'https://api.freeapi.app/api/v1/chat-app';

export async function GET() {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');
        
        const response = await fetch(`${BASE_URL}/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authorization && { Authorization: authorization }),
            },
        });
        
        const data = await response.json();
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');
        const body = await request.json();
        
        const response = await fetch(`${BASE_URL}/chats/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authorization && { Authorization: authorization }),
            },
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
