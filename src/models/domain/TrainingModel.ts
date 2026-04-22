export interface TrainingModel{
    session_id  : string;
    user_id : string;
    weight_id : string;
    num_data : number;
    label_count : number[];
    last_loss : number;
    loss : number[];
    created_at : string;
    status : string;
}