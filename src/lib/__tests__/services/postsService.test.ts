import {beforeEach, describe, expect, it, vi} from "vitest";
import * as postRepo from "$lib/server/repo/postsRepo";
import {createPost, deletePost, getPost, getPosts, updatePost} from "$lib/server/services/postsService";

// Мокаем репозиторий
vi.mock("$lib/server/repo/postsRepo");

const MOCK_POST = {id: 1, title: "Test", body: "Body"};
const MOCK_POSTS = [MOCK_POST]
const MOCK_UPDATED_POST = {id: 1, title: "Updated", body: "Body"};

describe("postService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
// GET
    describe("getPosts", () => {

        it("should return posts from repo", async () => {

            const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => MOCK_POSTS,
            } as Response);

            vi.mocked(postRepo.getPosts).mockReturnValue(MOCK_POSTS);
            vi.mocked(postRepo.initPosts).mockImplementation(() => {
            });

            const result = await getPosts(global.fetch);
            expect(result).toEqual(MOCK_POSTS);
        });
    });
// GET [id]
    describe("getPost", () => {

        it("should return post from repo if exists", async () => {
            vi.mocked(postRepo.getPost).mockReturnValue(MOCK_POST);

            const result = await getPost("1", global.fetch);
            expect(result).toEqual(MOCK_POST);
        });

        it("should fetch from external API if not in repo", async () => {
            vi.mocked(postRepo.getPost).mockReturnValue(undefined);
            const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({id: 1, title: "External"}),
            } as Response);

            const result = await getPost("1", global.fetch);
            expect(result).toEqual({id: 1, title: "External"});
        });

        it("should throw 404 if post not found", async () => {
            vi.mocked(postRepo.getPost).mockReturnValue(undefined);
            const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
            mockFetch.mockResolvedValue({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(getPost("9999", global.fetch)).rejects.toThrow();
        });
    });
// POST
    describe("createPost", () => {

        it("should create post in repo", async () => {
            vi.mocked(postRepo.createPost).mockReturnValue(MOCK_POST);

            const result = await createPost({title: "Test", body: "Body"});
            expect(result).toEqual(MOCK_POST);
        });
    });
// PUT
    describe("updatePost", () => {

        it("should update post in repo", async () => {
            vi.mocked(postRepo.updatePost).mockReturnValue(MOCK_UPDATED_POST);

            const result = await updatePost(1, {title: "Updated"});
            expect(result).toEqual(MOCK_UPDATED_POST);
        });

        it("should throw 404 if post not found", async () => {
            vi.mocked(postRepo.updatePost).mockReturnValue(null);

            await expect(updatePost(9999, {title: "New"})).rejects.toThrow();
        });
    });
// DELETE
    describe("deletePost", () => {
        
        it("should delete post in repo", async () => {

            vi.mocked(postRepo.deletePost).mockReturnValue(true);

            await expect(deletePost(1)).resolves.toBeUndefined();
        });

        it("should throw 404 if post not found", async () => {
            vi.mocked(postRepo.deletePost).mockReturnValue(false);

            await expect(deletePost(9999)).rejects.toThrow();
        });
    });
});