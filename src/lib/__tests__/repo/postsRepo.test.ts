import {describe, expect, it, vi} from "vitest";
import {createPost, getPost, getPosts} from "$lib/server/repo/postsRepo";
import {db} from "$lib/server/db/db";
import {MOCK_NEW_POST, MOCK_POSTS} from "$lib/__tests__/mockData";

// Мокаем реальную базу данных
vi.mock("$lib/server/db/db", () => ({
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

// GET
describe("getPosts", () => {
    it("should return empty array if no posts", async () => {
        vi.mocked(db.posts.findAll).mockResolvedValue([]);
        expect(await getPosts()).toEqual([]);
    });

    it("should return all posts", async () => {
        vi.mocked(db.posts.findAll).mockResolvedValue(MOCK_POSTS);
        const posts = await getPosts();
        expect(posts.length).toBe(2);
        expect(posts[0].title).toBe("Post 1");
        expect(posts[1].title).toBe("Post 2");
    });
});

// GET [id]
describe("getPost", () => {
    it("should return post by id", async () => {
        vi.mocked(db.posts.findById).mockResolvedValue(MOCK_POSTS[0]);
        const post = await getPost(1);
        expect(post).toBeDefined();
        expect(post?.title).toBe("Post 1");
        expect(post?.body).toBe("Body 1");
    });

    it("should return undefined if post not found", async () => {
        vi.mocked(db.posts.findById).mockResolvedValue(null);
        const post = await getPost(999);
        expect(post).toBeNull();
    });
});

// POST
describe('postsRepo', () => {
    it('should create a post in repo layer', async () => {
        vi.mocked(db.posts.insert).mockResolvedValue(MOCK_NEW_POST);
        const post = await createPost({ title: 'New Post', body: 'New Body' });
        expect(post.id).toBe(3);
        expect(post.title).toBe("New Post");
    });
});