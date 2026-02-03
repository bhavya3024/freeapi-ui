import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const BASE_URL = 'https://api.freeapi.app/api/v1/chat-app';

export async function GET(request, { params }) {
    try {
        const { chatId } = params;
        const headersList = await headers();
        const authorization = headersList.get('authorization');
        
        const response = await fetch(`${BASE_URL}/messages/${chatId}`, {
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

export async function POST(request, { params }) {
    try {
        const { chatId } = params;
        const headersList = await headers();
        const authorization = headersList.get('authorization');
        
        // Forward the FormData directly
        const formData = await request.formData();
        
        const response = await fetch(`${BASE_URL}/messages/${chatId}`, {
            method: 'POST',
            headers: {
                ...(authorization && { Authorization: authorization }),
            },
            body: formData,
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
