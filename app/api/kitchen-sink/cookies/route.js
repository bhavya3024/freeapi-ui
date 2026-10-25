import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        const cookies = {
            'sessionId': 'abc123xyz',
            'theme': 'dark',
            'language': 'en'
        };

        return NextResponse.json({
            status: 'success',
            message: 'Cookies retrieved',
            cookies
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request) {
    try {
        const { name, value } = await request.json();

        const response = NextResponse.json({
            status: 'success',
            message: 'Cookie set',
            cookie: { name, value }
        });

        response.cookies.set(name, value, { maxAge: 60 * 60 * 24 });

        return response;
    } catch (error) {
        return errorResponse(error);
    }
}
