import { createQueryParamHandler } from '../../../_lib/proxy';

export const GET = createQueryParamHandler('/public/youtube/related', 'id', 'videoId');
