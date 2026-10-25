import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        const data = JSON.stringify({
            status: 'success',
            message: 'This response is gzip compressed',
            timestamp: new Date().toISOString()
        });

        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            }
        });
    } catch (error) {
        return errorResponse(error);
    }
}
