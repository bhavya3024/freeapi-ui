import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

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
