import { proxyRequest, freeApiUrl } from '../../../../_lib/proxy';

export async function DELETE(_request, { params }) {
    const { chatId, messageId } = await Promise.resolve(params);
    const url = freeApiUrl(`/chat-app/messages/${chatId}/${messageId}`);
    return proxyRequest(url, { method: 'DELETE', auth: true });
}
