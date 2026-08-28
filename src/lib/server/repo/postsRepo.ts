import type {ICreatePost, IPost, IUpdatePostData} from "$lib/types";
import {db} from "$lib/server/db/db";

export async function resetRepo() {
    await db.posts.clear();
}

export async function initPosts(data: IPost[]) {
    await db.posts.clear();

    for (const post of data) {
        await db.posts.insertWithId({
            id: post.id,
            title: post.title,
            body: post.body,
            userId: post.userId || 1,
            createdAt: post.createdAt || new Date().toISOString(),
        });
    }
    await db.posts.resetSequence();
}


export async function getPosts(): Promise<IPost[]> {
    return db.posts.findAll();
}

export async function getPost(id: number): Promise<IPost | null> {
    return db.posts.findById(id);
}

export async function createPost(data: ICreatePost): Promise<IPost> {
    return db.posts.insert({
        ...data,
        userId: 1,
        createdAt: new Date().toISOString(),
    });
}

export async function updatePost(id: number, data: IUpdatePostData): Promise<IPost | null> {
    return db.posts.update(id, data);
}

export async function deletePost(id: number): Promise<boolean> {
    return db.posts.delete(id);
}