import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

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
