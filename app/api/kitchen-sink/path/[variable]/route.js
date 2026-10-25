import { NextResponse } from 'next/server';
import { errorResponse } from '../../../_lib/proxy';

export async function GET(_request, { params }) {
    try {
        const { variable } = params;

        return NextResponse.json({
            status: 'success',
            message: 'Path variable retrieved',
            variable
        });
    } catch (error) {
        return errorResponse(error);
    }
}
