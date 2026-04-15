export interface TrainingSessionResponse{
    session_id  : string;
    user_id : string;
    weight_id : string;
    num_data : number;
    label_count : number[];
    average_loss : number;
    loss : number[];
    created_at : string;
    status : string;
}