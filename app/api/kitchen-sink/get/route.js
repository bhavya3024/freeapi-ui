import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        return NextResponse.json({
            status: 'success',
            message: 'GET request successful',
            timestamp: new Date().toISOString(),
            query: Object.fromEntries(searchParams)
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        return NextResponse.json({
            status: 'success',
            message: 'POST request successful',
            timestamp: new Date().toISOString(),
            received: body
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();

        return NextResponse.json({
            status: 'success',
            message: 'PUT request successful',
            timestamp: new Date().toISOString(),
            received: body
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();

        return NextResponse.json({
            status: 'success',
            message: 'PATCH request successful',
            timestamp: new Date().toISOString(),
            received: body
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function DELETE() {
    try {
        return NextResponse.json({
            status: 'success',
            message: 'DELETE request successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return errorResponse(error);
    }
}
