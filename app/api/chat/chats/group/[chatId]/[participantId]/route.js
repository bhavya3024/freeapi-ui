import { proxyRequest, freeApiUrl } from '../../../../../_lib/proxy';

export async function POST(_request, { params }) {
    const { chatId, participantId } = await Promise.resolve(params);
    const url = freeApiUrl(`/chat-app/chats/group/${chatId}/${participantId}`);
    return proxyRequest(url, { method: 'POST', auth: true });
}

export async function DELETE(_request, { params }) {
    const { chatId, participantId } = await Promise.resolve(params);
    const url = freeApiUrl(`/chat-app/chats/group/${chatId}/${participantId}`);
    return proxyRequest(url, { method: 'DELETE', auth: true });
}
