import {beforeEach, describe, expect, it} from "vitest";
import {createPost, deletePost, getPost, getPosts, initPosts, resetRepo, updatePost} from "$lib/server/repo/postsRepo";

beforeEach(async () => {
    await resetRepo()
})

const MOCK_POSTS = [
    { id: 5, title: "Post 5", body: "Body 5" },
    { id: 10, title: "Post 10", body: "Body 10" },
];
const MOCK_POST1 = [{ id: 1, title: "Post 1", body: "Body 1" }];
const MOCK_POST2 = [{ id: 2, title: "Post 2", body: "Body 2" }];

// GET
describe("getPosts", () => {
    it("should return empty array if no posts", async () => {
        expect(await getPosts()).toEqual([]);
    });

    it("should return all posts", async () => {
        await createPost({ title: "Post 1", body: "Body 1" });
        await createPost({ title: "Post 2", body: "Body 2" });
        const posts = await getPosts();
        expect(posts.length).toBe(2);
        expect(posts[0].title).toBe("Post 1");
        expect(posts[1].title).toBe("Post 2");
    });
});

// GET [id]
describe("getPost", () => {
    it("should return post by id", async () => {
        await createPost({ title: "Test", body: "Body" });
        const post = await getPost(1);
        expect(post).toBeDefined();
        expect(post?.title).toBe("Test");
        expect(post?.body).toBe("Body");
    });

    it("should return undefined if post not found", async () => {
        const post = await getPost(999);
        expect(post).toBeNull()
    });
});

// POST
describe('postsRepo', () => {
    it('should create a post in repo layer', async () => {
        const post = await createPost({ title: 'Test', body: 'Body' })
        expect(post.id).toBe(1)
        const posts = await getPosts();
        expect(posts.length).toBe(1)
    })

    it("should increment id for each new post", async () => {
        await createPost({ title: "Post 1", body: "Body 1" });
        const post2 = await createPost({ title: "Post 2", body: "Body 2" });
        expect(post2.id).toBe(2);
        const posts = await getPosts();
        expect(posts.length).toBe(2);
    });
})

// PUT
describe("updatePost", () => {
    it("should update existing post", async () => {
        await createPost({ title: "Old Title", body: "Old Body" });
        const updated = await updatePost(1, { title: "New Title", body: "New Body" });
        expect(updated).toBeDefined();
        expect(updated?.title).toBe("New Title");
        expect(updated?.body).toBe("New Body");

        const post = await getPost(1);
        expect(post?.title).toBe("New Title");
        expect(post?.body).toBe("New Body");
    });

    it("should update only title", async () => {
        await createPost({ title: "Old Title", body: "Old Body" });
        const updated = await updatePost(1, { title: "New Title" });
        expect(updated?.title).toBe("New Title");
        expect(updated?.body).toBe("Old Body");
    });

    it("should update only body", async () => {
        await createPost({ title: "Old Title", body: "Old Body" });
        const updated = await updatePost(1, { body: "New Body" });
        expect(updated?.title).toBe("Old Title");
        expect(updated?.body).toBe("New Body");
    });

    it("should return null if post not found", async () => {
        const result = await updatePost(9999, { title: "New Title" });
        expect(result).toBeNull();
    });
});

// DELETE
describe("deletePost", () => {
    it("should delete existing post", async () => {
        await createPost({ title: "Test", body: "Body" });
        const posts = await getPosts();
        expect(posts.length).toBe(1);

        const result = await deletePost(1);
        expect(result).toBe(true);
        const postsAfterDelete = await getPosts();
        expect(postsAfterDelete.length).toBe(0);
        const post = await getPost(1);
        expect(post).toBeNull()
    });

    it("should return false if post not found", async () => {
        const result = await deletePost(9999);
        expect(result).toBe(false);
    });
});

// INIT
describe("initPosts", () => {
    it("should initialize posts", async () => {
        await initPosts(MOCK_POSTS);
        const posts = await getPosts();
        expect(posts.length).toBe(2);
        expect(posts[0].id).toBe(5);
        expect(posts[1].id).toBe(10);
    });

    it("should set nextId correctly after initialization", async () => {
        await initPosts(MOCK_POSTS);
        const newPost = await createPost({ title: "New", body: "New Body" });
        expect(newPost.id).toBe(11); // max id + 1
    });

    it("should not re-initialize if already initialized", async () => {
        await initPosts([{ id: 1, title: "Post 1", body: "Body 1" }]);
        await initPosts([{ id: 2, title: "Post 2", body: "Body 2" }]);
        const posts = await getPosts();
        expect(posts.length).toBe(1);
        expect(posts[0].id).toBe(1);
        expect(posts[0].title).toBe("Post 1");
    });
});