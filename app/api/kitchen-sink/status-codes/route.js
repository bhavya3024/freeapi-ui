import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

const statusCodes = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
};

export async function GET() {
    try {
        return NextResponse.json({
            status: 'success',
            message: 'All status codes',
            statusCodes
        });
    } catch (error) {
        return errorResponse(error);
    }
}
