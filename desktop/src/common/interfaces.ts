export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
} 