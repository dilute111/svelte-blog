import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен'),
    body: z.string().min(1, 'Текст обязателен'),
});

export const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;