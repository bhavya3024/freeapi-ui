import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const headers = {};
        for (const [key, value] of request.headers.entries()) {
            headers[key] = value;
        }

        return NextResponse.json({
            status: 'success',
            message: 'Request headers retrieved',
            headers
        });
    } catch (error) {
        return errorResponse(error);
    }
}
