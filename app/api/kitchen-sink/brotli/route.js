import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        return NextResponse.json(
            {
                status: 'success',
                message: 'This response is brotli compressed',
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    'Content-Encoding': 'br'
                }
            }
        );
    } catch (error) {
        return errorResponse(error);
    }
}
