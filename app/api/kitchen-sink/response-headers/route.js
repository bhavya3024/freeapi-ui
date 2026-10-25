import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET(request) {
    try {
        const headers = {};
        request.headers.forEach((value, key) => {
            headers[key] = value;
        });

        return NextResponse.json(
            {
                status: 'success',
                message: 'Response headers retrieved',
                headers
            },
            {
                headers: {
                    'X-Custom-Header': 'Kitchen Sink API',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    } catch (error) {
        return errorResponse(error);
    }
}
