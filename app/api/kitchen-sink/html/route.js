import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>HTML Response</title>
            </head>
            <body>
                <h1>Welcome to Kitchen Sink API</h1>
                <p>This is an HTML response from the API.</p>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        return errorResponse(error);
    }
}
