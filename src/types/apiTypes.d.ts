export interface Pagination {
    total: number;
    filtered_total: number;
    per_page: number;
    page_count: number;
    current_page: number;
}

export interface ListResponse<T> {
    success: boolean;
    [key: string]: T;
    pagination: Pagination;
    total: number;
    elapsed_time: string;
    memory_usage: number;
}

export interface PostResponse {
    success: boolean;
    id: number;
    elapsed_time: string;
    memory_usage: number;
}

export interface PutResponse<T> {
    success: boolean;
    [key: string]: T;
    elapsed_time: string;
    memory_usage: number;
}

export interface DeleteResponse {
    success: boolean;
    elapsed_time: string;
    memory_usage: number;
}