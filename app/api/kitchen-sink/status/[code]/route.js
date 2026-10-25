import { NextResponse } from 'next/server';
import { errorResponse } from '../../../_lib/proxy';

export async function GET(_request, { params }) {
    try {
        const { code } = params;
        const statusCode = parseInt(code, 10);

        if (statusCode < 100 || statusCode > 599) {
            return NextResponse.json(
                { error: 'Invalid status code', code },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                status: 'success',
                message: `Status code ${statusCode}`,
                code: statusCode
            },
            { status: statusCode }
        );
    } catch (error) {
        return errorResponse(error);
    }
}
