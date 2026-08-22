import type {IPostRow} from "$lib/types";

const posts: IPostRow[] = [];
let nextId = 1;

export const db = {
    posts: {
        findAll: () => [...posts],
        findById: (id: number) => posts.find(p => p.id === id),
        insert: (data: Omit<IPostRow, 'id'>) => {
            const newPost = { id: nextId++, ...data };
            posts.push(newPost);
            return newPost;
        },
        insertWithId: (data: IPostRow) => {
            posts.push(data);
            nextId = Math.max(nextId, data.id + 1);
            return data;
        },
        update: (id: number, data: Partial<Omit<IPostRow, 'id'>>) => {
            const index = posts.findIndex(p => p.id === id);
            if (index === -1) return null;
            posts[index] = { ...posts[index], ...data };
            return posts[index];
        },
        delete: (id: number) => {
            const index = posts.findIndex(p => p.id === id);
            if (index === -1) return false;
            posts.splice(index, 1);
            return true;
        },
        clear: () => {
            posts.length = 0;
            nextId = 1;
        },
    }
};
