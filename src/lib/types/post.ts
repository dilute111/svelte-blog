export interface IPost {
    id: number
    title: string
    body: string
    userId?: number
    createdAt?: string
    updatedAt?: string
}

export interface ICreatePost {
    title: string
    body: string
}

export interface IPostResponse {
    posts: IPost[]
}

export interface IUpdatePostData {
     title?: string;
     body?: string
}

export interface IPostProps {
    post: IPost | null;
    error: string | null
    isEditing?: boolean;
    editTitle: string
    editBody: string
    onTitleChange: (value: string) => void
    onBodyChange: (value: string) => void
    onSave?: () => void;
    onCancel?: () => void;
    onEdit?: () => void;
}

export interface IPostListProps {
    posts: IPost[]
    isFromCache: boolean
    onDelete: (id: number) => void
}