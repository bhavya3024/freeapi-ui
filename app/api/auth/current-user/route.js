import { createAuthGetHandler } from '../../_lib/proxy';

export const GET = createAuthGetHandler('/users/current-user');
