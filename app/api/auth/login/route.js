import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.freeapi.app/api/v1/users';

export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
