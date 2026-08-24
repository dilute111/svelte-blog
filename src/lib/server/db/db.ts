import { Pool } from 'pg';
import type { IPostRow } from '$lib/types';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'svelte_blog',
    port: 5432,
    password: 'password',
});

export const db = {
    posts: {
        findAll: async (): Promise<IPostRow[]> => {
            const result = await pool.query('SELECT * FROM posts ORDER BY id ASC');
            return result.rows;
        },
        findById: async (id: number): Promise<IPostRow | null> => {
            const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
            return result.rows[0] || null;
        },
        insert: async (data: Omit<IPostRow, 'id'>): Promise<IPostRow> => {
            const result = await pool.query(
                `INSERT INTO posts (title, body, user_id, created_at)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [data.title, data.body, data.userId, data.createdAt]
            );
            return result.rows[0];
        },
        insertWithId: async (data: IPostRow): Promise<IPostRow> => {
            const result = await pool.query(
                `INSERT INTO posts (id, title, body, user_id, created_at)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id) DO UPDATE SET
                     title = EXCLUDED.title,
                     body = EXCLUDED.body,
                     user_id = EXCLUDED.user_id,
                     created_at = EXCLUDED.created_at
                 RETURNING *`,
                [data.id, data.title, data.body, data.userId, data.createdAt]
            );
            return result.rows[0];
        },
        update: async (id: number, data: Partial<Omit<IPostRow, 'id'>>): Promise<IPostRow | null> => {
            const fields = [];
            const values = [];
            let idx = 1;

            if (data.title !== undefined) {
                fields.push(`title = $${idx++}`);
                values.push(data.title);
            }
            if (data.body !== undefined) {
                fields.push(`body = $${idx++}`);
                values.push(data.body);
            }
            if (data.userId !== undefined) {
                fields.push(`user_id = $${idx++}`);
                values.push(data.userId);
            }
            if (data.createdAt !== undefined) {
                fields.push(`created_at = $${idx++}`);
                values.push(data.createdAt);
            }

            if (fields.length === 0) return null;

            const query = `
                UPDATE posts SET ${fields.join(', ')}
                WHERE id = $${idx}
                RETURNING *
            `;

            const result = await pool.query(query, [...values, id]);
            return result.rows[0] || null;
        },
        delete: async (id: number): Promise<boolean> => {
            const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        },
        clear: async (): Promise<void> => {
            await pool.query('DELETE FROM posts');
            await pool.query('ALTER SEQUENCE posts_id_seq RESTART WITH 1');
        },
        resetSequence: async (): Promise<void> => {  // ← ДОБАВЬ ЭТО
            await pool.query('SELECT setval(\'posts_id_seq\', (SELECT MAX(id) FROM posts))');
        },
    },
};