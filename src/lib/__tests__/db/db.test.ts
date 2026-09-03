import {describe, expect, it, vi} from 'vitest';
import {db} from '$lib/server/db/db';
import {MOCK_NEW_POST, MOCK_POSTS} from '$lib/__tests__/mockData';

// Мокаем сам модуль db
vi.mock('$lib/server/db/db', () => ({
    db: {
        posts: {
            findAll: vi.fn(),
            findById: vi.fn(),
            insert: vi.fn(),
            insertWithId: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
            resetSequence: vi.fn(),
        },
    },
}));

describe('db.posts', () => {
    // GET
    describe('findAll', () => {

        it('should return all posts', async () => {
            vi.mocked(db.posts.findAll).mockResolvedValue(MOCK_POSTS);

            const result = await db.posts.findAll();

            expect(db.posts.findAll).toHaveBeenCalled();
            expect(result).toEqual(MOCK_POSTS);
        });

        it('should return empty array if no posts', async () => {
            vi.mocked(db.posts.findAll).mockResolvedValue([]);

            const result = await db.posts.findAll();

            expect(result).toEqual([]);
        });
    });
    // GET [id]
    describe('findById', () => {

        it('should return post by id', async () => {
            vi.mocked(db.posts.findById).mockResolvedValue(MOCK_POSTS[0]);

            const result = await db.posts.findById(1);

            expect(db.posts.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(MOCK_POSTS[0]);
        });

        it('should return null if post not found', async () => {
            vi.mocked(db.posts.findById).mockResolvedValue(null);

            const result = await db.posts.findById(999);

            expect(result).toBeNull();
        });
    });
    // POST
    describe('insert', () => {

        it('should insert a new post', async () => {
            vi.mocked(db.posts.insert).mockResolvedValue(MOCK_NEW_POST);

            const result = await db.posts.insert({
                title: MOCK_NEW_POST.title,
                body: MOCK_NEW_POST.body,
                userId: MOCK_NEW_POST.userId,
                createdAt: MOCK_NEW_POST.createdAt
            });

            expect(db.posts.insert).toHaveBeenCalledWith({
                title: MOCK_NEW_POST.title,
                body: MOCK_NEW_POST.body,
                userId: MOCK_NEW_POST.userId,
                createdAt: MOCK_NEW_POST.createdAt
            });
            expect(result).toEqual(MOCK_NEW_POST);
        });
    });

    describe('insertWithId', () => {

        it('should insert post with specific id', async () => {
            vi.mocked(db.posts.insertWithId).mockResolvedValue(MOCK_NEW_POST);

            const result = await db.posts.insertWithId(MOCK_NEW_POST);

            expect(db.posts.insertWithId).toHaveBeenCalledWith(MOCK_NEW_POST);
            expect(result).toEqual(MOCK_NEW_POST);
        });
    });
    // PUT
    describe('update', () => {

        it('should update post title', async () => {
            const updatedPost = { ...MOCK_POSTS[0], title: 'Updated' };
            vi.mocked(db.posts.update).mockResolvedValue(updatedPost);

            const result = await db.posts.update(1, { title: 'Updated' });

            expect(db.posts.update).toHaveBeenCalledWith(1, { title: 'Updated' });
            expect(result).toEqual(updatedPost);
        });

        it('should return null if post not found', async () => {
            vi.mocked(db.posts.update).mockResolvedValue(null);

            const result = await db.posts.update(999, { title: 'Updated' });

            expect(result).toBeNull();
        });
    });
    // DELETE
    describe('delete', () => {

        it('should return true if post deleted', async () => {
            vi.mocked(db.posts.delete).mockResolvedValue(true);

            const result = await db.posts.delete(1);

            expect(db.posts.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should return false if post not found', async () => {
            vi.mocked(db.posts.delete).mockResolvedValue(false);

            const result = await db.posts.delete(999);

            expect(result).toBe(false);
        });
    });
    // CLEAR
    describe('clear', () => {

        it('should clear all posts', async () => {
            vi.mocked(db.posts.clear).mockResolvedValue();

            await db.posts.clear();

            expect(db.posts.clear).toHaveBeenCalled();
        });
    });
    // RESET
    describe('resetSequence', () => {

        it('should reset sequence', async () => {
            vi.mocked(db.posts.resetSequence).mockResolvedValue();

            await db.posts.resetSequence();

            expect(db.posts.resetSequence).toHaveBeenCalled();
        });
    });
});