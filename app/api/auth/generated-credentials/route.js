export async function GET() {
    try {
        // Return pre-seeded test credentials
        // These can be used for demo purposes
        const testCredentials = {
            email: 'demo@example.com',
            username: 'demoluser',
            password: 'Demo@123456'
        };

        return Response.json(
            {
                statusCode: 200,
                data: testCredentials,
                message: 'Generated credentials fetched successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                statusCode: 500,
                data: null,
                message: 'Failed to fetch generated credentials',
                success: false
            },
            { status: 500 }
        );
    }
}
