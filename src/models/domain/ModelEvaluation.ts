export default interface ModelEvaluation{
    accuracy : Array<number>,
    error_rate : Array<number>,
    recall : Array<number>,
    precision : Array<number>,
    f1_score : Array<number>,
    confusion_matrix : Array<Array<number>>
}