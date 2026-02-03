import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.freeapi.app/api/v1/public/randomusers';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const results = searchParams.get('results') || '10';
        
        const response = await fetch(`${BASE_URL}?page=${page}&results=${results}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
