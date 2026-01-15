// types/itemTypes.ts
export interface InItemForm {
    id?: number;
    item: string;
    description: string;
}

export interface InItem {
    id: number;
    item: string;
    description: string;
    created_at: number;
    deleted_at?: number;  // Tambahkan ? jika optional
}

export interface InItemResponse {
    items: InItem[];
}
