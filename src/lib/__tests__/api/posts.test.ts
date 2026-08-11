import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../routes/api/posts/+server';
import * as postService from '$lib/server/services/postsService';
import { requireAuth } from '$lib/server/middleware/auth';
import type {RequestEvent} from "@sveltejs/kit";
import type {HttpError} from "$lib/__tests__/test.utils";

vi.mock('$lib/server/services/postsService');
vi.mock('$lib/server/middleware/auth');

const MOCK_POSTS = [
    { id: 1, title: 'Test Post 1', body: 'Body 1' },
    { id: 2, title: 'Test Post 2', body: 'Body 2' },
];
const MOCK_NEW_POST = { id: 3, title: 'New Post', body: 'New Body' };


describe('API /api/posts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return posts', async () => {
            vi.mocked(postService.getPosts).mockResolvedValue(MOCK_POSTS);

            const response = await GET({ fetch: global.fetch });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(MOCK_POSTS);
        });
    });
    describe('POST', () => {
        it('should create a post', async () => {
            vi.mocked(requireAuth).mockImplementation(() => {});
            vi.mocked(postService.createPost).mockResolvedValue(MOCK_NEW_POST);

            const request = {
                json: async () => ({ title: 'New Post', body: 'New Body' }),
            } as Request;

            const response = await POST({
                request, locals: {}
            } as RequestEvent);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(MOCK_NEW_POST);
            expect(postService.createPost).toHaveBeenCalledWith({
                title: 'New Post',
                body: 'New Body',
            });
        });

        it('should return 400 if title is missing', async () => {
            vi.mocked(requireAuth).mockImplementation(() => {});

            const request = {
                json: async () => ({ body: 'New Body' }),
            } as Request;

            try {
                await POST({ request, locals: {} } as RequestEvent);
            } catch (error) {
                const err = error as HttpError
                expect(err.status).toBe(400);
                expect(err.body?.message).toBe('Title and body are required');
            }
        });

        it('should return 400 if body is missing', async () => {
            vi.mocked(requireAuth).mockImplementation(() => {});

            const request = {
                json: async () => ({ title: 'New Post' }),
            } as Request;

            try {
                await POST({ request, locals: {} } as RequestEvent);
            } catch (error) {
                const err = error as HttpError
                expect(err.status).toBe(400);
                expect(err.body?.message).toBe('Title and body are required');
            }
        });

        it('should return 401 if not authorized', async () => {
            vi.mocked(requireAuth).mockImplementation(() => {
                throw { status: 401, message: 'Unauthorized' };
            });

            const request = {
                json: async () => ({ title: 'New Post', body: 'New Body' }),
            } as Request;

            try {
                await POST({ request, locals: {} } as RequestEvent);
            } catch (error) {
                const err = error as HttpError;
                expect(err.status).toBe(401);
            }
        });
    });
});