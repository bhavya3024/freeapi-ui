import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

        return NextResponse.json({
            status: 'success',
            message: 'Client IP retrieved',
            ip
        });
    } catch (error) {
        return errorResponse(error);
    }
}
