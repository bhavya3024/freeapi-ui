import { createAuthGetHandler } from '../../_lib/proxy';
import { proxyRequest, freeApiUrl } from '../../_lib/proxy';

export const GET = createAuthGetHandler('/chat-app/chats');

export async function POST(request) {
    const body = await request.json();
    return proxyRequest(freeApiUrl('/chat-app/chats/group'), {
        method: 'POST',
        body,
        auth: true,
    });
}
