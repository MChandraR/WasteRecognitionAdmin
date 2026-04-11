export interface ServiceCallback<T>{
    onSuccess: (data: T) => void;
    onError: (error: string) => void;
}