import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams);

        return NextResponse.json({
            status: 'success',
            message: 'Query parameters retrieved',
            parameters: params
        });
    } catch (error) {
        return errorResponse(error);
    }
}
