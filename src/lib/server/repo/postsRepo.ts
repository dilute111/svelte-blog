import type {ICreatePost, IPost, IUpdatePostData} from "$lib/types";
import {db} from "$lib/server/db/db";

let initialized = false

export function resetRepo() {
    db.posts.clear();
    initialized = false;
}

export function initPosts(data: IPost[]) {
    if (!initialized) {
        db.posts.clear();
        data.forEach(post => {
            db.posts.insertWithId({
                id: post.id,
                title: post.title,
                body: post.body,
                userId: post.userId || 1,
                createdAt: post.createdAt || new Date().toISOString(),
            });
        });
        initialized = true;
    }
}

export function getPosts(): IPost[] {
    return db.posts.findAll();
}

export function getPost(id: number): IPost | undefined {
    return db.posts.findById(id);
}

export function createPost(data: ICreatePost): IPost {
    return db.posts.insert({
        ...data,
        userId: 1,
        createdAt: new Date().toISOString(),
    });
}

export function updatePost( id: number, data: IUpdatePostData ): IPost | null {
    return db.posts.update(id, data);
}

export function deletePost(id: number): boolean {
    return db.posts.delete(id);
}