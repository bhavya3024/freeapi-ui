import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.freeapi.app/api/v1/public/randomproducts';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        const response = await fetch(`${BASE_URL}/${id}`, {
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
