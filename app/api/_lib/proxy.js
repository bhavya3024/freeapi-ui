import { NextResponse } from 'next/server';
import { headers as nextHeaders } from 'next/headers';

const FREEAPI_BASE = 'https://api.freeapi.app/api/v1';

/**
 * Constructs a full FreeAPI URL from a relative path.
 * @param {string} path - Path relative to the FreeAPI v1 root (e.g. "/public/cats")
 * @returns {string}
 */
export function freeApiUrl(path) {
    return `${FREEAPI_BASE}${path}`;
}

/**
 * Generic proxy that forwards a request to the FreeAPI backend and returns
 * the JSON response. Covers the pattern used by ~90 % of the route handlers.
 *
 * @param {string}  url              - Full upstream URL to fetch.
 * @param {object}  [options]        - Optional configuration.
 * @param {string}  [options.method] - HTTP method (default: "GET").
 * @param {object}  [options.body]   - Body to JSON-stringify and forward.
 * @param {boolean} [options.auth]   - If true, forwards the Authorization header.
 * @param {object}  [options.extraHeaders] - Additional headers to merge.
 * @returns {Promise<NextResponse>}
 */
export async function proxyRequest(url, options = {}) {
    const { method = 'GET', body, auth = false, extraHeaders } = options;

    try {
        const fetchHeaders = { 'Content-Type': 'application/json', ...extraHeaders };

        if (auth) {
            const headersList = await nextHeaders();
            const authorization = headersList.get('authorization');
            if (authorization) {
                fetchHeaders['Authorization'] = authorization;
            }
        }

        const fetchOptions = { method, headers: fetchHeaders };
        if (body !== undefined) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return errorResponse(error);
    }
}

/**
 * Returns a standard 500 JSON error response.
 * @param {Error} error
 * @returns {NextResponse}
 */
export function errorResponse(error) {
    return NextResponse.json(
        { message: 'Internal server error', error: error.message },
        { status: 500 },
    );
}

// ─── Convenience builders for the most common proxy route shapes ─────────────

/**
 * Creates a paginated list GET handler.
 * Maps `?page=&results=` query params to FreeAPI's `?page=&limit=` and proxies to the given path.
 *
 * @param {string} upstreamPath - Path appended to FREEAPI_BASE (e.g. "/public/cats").
 * @returns {Function} Next.js GET route handler
 */
export function createPaginatedListHandler(upstreamPath) {
    return async function GET(request) {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const results = searchParams.get('results') || '10';
        const url = `${freeApiUrl(upstreamPath)}?page=${page}&limit=${results}`;
        return proxyRequest(url);
    };
}

/**
 * Creates a GET-by-ID handler.
 *
 * @param {string} upstreamPath - Path appended to FREEAPI_BASE (e.g. "/public/cats").
 * @param {string} [paramName]  - Name of the dynamic param (default: "id").
 * @returns {Function} Next.js GET route handler
 */
export function createGetByIdHandler(upstreamPath, paramName = 'id') {
    return async function GET(_request, context) {
        const resolvedParams = await Promise.resolve(context?.params);
        const value = resolvedParams?.[paramName];
        const url = `${freeApiUrl(upstreamPath)}/${value}`;
        return proxyRequest(url);
    };
}

/**
 * Creates a random-item GET handler.
 *
 * @param {string} upstreamPath - Full random endpoint path (e.g. "/public/randomcats").
 * @returns {Function} Next.js GET route handler
 */
export function createRandomHandler(upstreamPath) {
    return async function GET() {
        const url = `${freeApiUrl(upstreamPath)}?limit=1`;
        return proxyRequest(url);
    };
}

/**
 * Creates a simple GET handler that proxies to a fixed URL with no params.
 *
 * @param {string} upstreamPath - Path appended to FREEAPI_BASE.
 * @returns {Function} Next.js GET route handler
 */
export function createSimpleGetHandler(upstreamPath) {
    return async function GET() {
        return proxyRequest(freeApiUrl(upstreamPath));
    };
}

/**
 * Creates a GET handler that forwards a single query-style dynamic param.
 * Useful for routes like `/videos/[id]/comments` → `?videoId=<id>`.
 *
 * @param {string} upstreamPath  - Path appended to FREEAPI_BASE.
 * @param {string} paramName     - Route param name (e.g. "id").
 * @param {string} queryParamKey - Query-string key sent upstream (e.g. "videoId").
 * @returns {Function} Next.js GET route handler
 */
export function createQueryParamHandler(upstreamPath, paramName, queryParamKey) {
    return async function GET(_request, context) {
        const resolvedParams = await Promise.resolve(context?.params);
        const value = resolvedParams?.[paramName];
        const url = `${freeApiUrl(upstreamPath)}?${queryParamKey}=${value}`;
        return proxyRequest(url);
    };
}

/**
 * Creates a POST handler that reads JSON body and forwards it.
 *
 * @param {string}  upstreamPath - Path appended to FREEAPI_BASE.
 * @param {boolean} [auth]       - Whether to forward the Authorization header.
 * @returns {Function} Next.js POST route handler
 */
export function createPostHandler(upstreamPath, auth = false) {
    return async function POST(request) {
        const body = await request.json();
        return proxyRequest(freeApiUrl(upstreamPath), { method: 'POST', body, auth });
    };
}

/**
 * Creates an authenticated GET handler (forwards Authorization header).
 *
 * @param {string} upstreamPath - Path appended to FREEAPI_BASE.
 * @returns {Function} Next.js GET route handler
 */
export function createAuthGetHandler(upstreamPath) {
    return async function GET() {
        return proxyRequest(freeApiUrl(upstreamPath), { auth: true });
    };
}

/**
 * Creates an authenticated POST handler (no body, forwards Authorization header).
 *
 * @param {string} upstreamPath - Path appended to FREEAPI_BASE.
 * @returns {Function} Next.js POST route handler
 */
export function createAuthPostHandler(upstreamPath) {
    return async function POST() {
        return proxyRequest(freeApiUrl(upstreamPath), { method: 'POST', auth: true });
    };
}
