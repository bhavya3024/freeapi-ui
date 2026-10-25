import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const userAgent = request.headers.get('user-agent') || 'unknown';

        return NextResponse.json({
            status: 'success',
            message: 'User agent retrieved',
            userAgent
        });
    } catch (error) {
        return errorResponse(error);
    }
}
