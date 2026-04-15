import APIResponse from "@/models/APIResponse/APIResponse";
import APIService from "./APIService";
import DistributedTrainingLabelResponse from "@/models/APIResponse/DistributedTrainingLabelResponse";
import TotalTrainingCount from "@/models/domain/TotalTrainingCount";
import TotalTrainingSessionCount from "@/models/APIResponse/TotalTrainingSessionCount";
import { TrainingModel } from "@/models/domain/TrainingModel";
import HandleAxiosException from "@/util/HandleAxiosExcption";
import { TrainingSessionResponse } from "@/models/APIResponse/TrainingSessionResponse";

const TrainingSessionService = {
    async getDistributedLabel(): Promise<DistributedTrainingLabelResponse>{
        try{
            const response = await APIService.get<APIResponse<DistributedTrainingLabelResponse>>("/training/label");
            return {
                label_count : response.data.data?.label_count ?? []
            }
        }catch{
            return { label_count : []}
        }
    },

    async getTotalTrainingSessionCount() : Promise<TotalTrainingCount|undefined>{
        try{
            const response = await APIService.get<APIResponse<TotalTrainingSessionCount>>("/training/count")
            const data = response.data.data
            if(data == undefined) return
            return {
                total_pending : data.total_pending,
                total_trained : data.total_trained
            }
        }catch{
            return 
        }
    },

    async getAllTrainingData() : Promise<APIResponse<TrainingModel[]>>{
        try{
            const response = await APIService.get<APIResponse<TrainingSessionResponse[]>>("/training");
            return {
                status : response.status,
                message : response.data.message,
                data : response.data.data
            }
        }catch(exception){
            return new Promise((resolve) => {
                HandleAxiosException(exception, (result) => {
                    resolve({
                        status: result.status,
                        message: result.message,
                        data: undefined
                    });
                });
            });
        }
    }
}

export default TrainingSessionService;