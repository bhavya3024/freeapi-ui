import { NextResponse } from 'next/server';
import { errorResponse } from '../../_lib/proxy';

export async function GET() {
    try {
        const xml = `
            <?xml version="1.0" encoding="UTF-8"?>
            <root>
                <status>success</status>
                <message>This is an XML response from the Kitchen Sink API</message>
            </root>
        `;

        return new NextResponse(xml, {
            status: 200,
            headers: { 'Content-Type': 'application/xml' }
        });
    } catch (error) {
        return errorResponse(error);
    }
}
