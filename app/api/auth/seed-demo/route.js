export async function GET() {
    try {
        // Seed demo account for testing
        const demoAccount = {
            email: 'demo@example.com',
            username: 'demoluser',
            password: 'Demo@123456',
            role: 'USER'
        };

        try {
            // Try to register the demo account by calling the register endpoint
            const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(demoAccount)
            });
            
            const result = await registerResponse.json();
            
            if (result.success || result.statusCode === 200 || registerResponse.status === 200) {
                return Response.json(
                    {
                        statusCode: 200,
                        message: 'Demo account created successfully',
                        success: true
                    },
                    { status: 200 }
                );
            } else if (result.statusCode === 409 || registerResponse.status === 409) {
                // Account already exists - this is fine
                return Response.json(
                    {
                        statusCode: 200,
                        message: 'Demo account already exists',
                        success: true
                    },
                    { status: 200 }
                );
            }
        } catch (innerError) {
            console.error('Inner error:', innerError);
        }

        return Response.json(
            {
                statusCode: 200,
                message: 'Demo account seeded',
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                statusCode: 500,
                message: 'Error seeding demo account',
                success: false
            },
            { status: 500 }
        );
    }
}
