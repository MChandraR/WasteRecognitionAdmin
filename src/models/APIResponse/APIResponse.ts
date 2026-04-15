export default interface APIResponse<T> { 
    data?: T|undefined;
    message: string;
    status: number;
}