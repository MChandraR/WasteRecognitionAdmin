export default interface APIResponse<T> { 
    data: T;
    message: string;
    status: number;
}