import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        return NextResponse.json(
            {
                status: 'success',
                message: 'Cache control header set',
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    'Cache-Control': 'public, max-age=3600, must-revalidate'
                }
            }
        );
    } catch (error) {
        return errorResponse(error);
    }
}
