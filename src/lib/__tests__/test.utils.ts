export interface HttpError {
    status: number;
    message?: string;
    body?: {
        message: string;
    };
}