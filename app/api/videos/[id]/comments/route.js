import { createQueryParamHandler } from '../../../_lib/proxy';

export const GET = createQueryParamHandler('/public/youtube/comments', 'id', 'videoId');
