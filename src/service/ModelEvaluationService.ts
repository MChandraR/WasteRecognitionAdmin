import APIService from "./APIService";
import APIResponse from "@/models/APIResponse/APIResponse";
import ModelEvaluation from "@/models/domain/ModelEvaluation";
import ModelEvaluationResponse from "@/models/APIResponse/ModelEvaluationResponse";

const ModelEvaluationService = {
    async getModelEvaluationData() : Promise<Array<ModelEvaluation>|undefined>{
        try{
            const response = await APIService.get<APIResponse<Array<ModelEvaluationResponse>>>("/model/evaluation")
            const data =  response.data.data

            return data
        }catch{
            console.log("Terjadi masalah saat mengambil data evaluasi dari server")
            return
        }
    }
}

export default ModelEvaluationService;