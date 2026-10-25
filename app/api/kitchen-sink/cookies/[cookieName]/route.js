import { NextResponse } from 'next/server';
import { errorResponse } from '../../../_lib/proxy';

export async function DELETE(_request, { params }) {
    try {
        const { cookieName } = params;

        const response = NextResponse.json({
            status: 'success',
            message: 'Cookie removed',
            cookie: cookieName
        });

        response.cookies.delete(cookieName);

        return response;
    } catch (error) {
        return errorResponse(error);
    }
}
