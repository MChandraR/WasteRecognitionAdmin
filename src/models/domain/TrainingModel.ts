export interface TrainingModel{
    session_id  : string;
    user_id : string;
    weight_id : string;
    num_data : number;
    label_count : number[];
     init_loss : number;
    training_loss : number[];
    final_loss : number;
    created_at : number;
    init_accuracy : number;
    training_accuracy : number[];
    final_accuracy : number;
    model_version : string;
}