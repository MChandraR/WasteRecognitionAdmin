import APIResponse from "@/models/APIResponse/APIResponse";
import APIService from "./APIService";
import DistributedTrainingLabelResponse from "@/models/APIResponse/DistributedTrainingLabelResponse";
import TotalTrainingCount from "@/models/domain/TotalTrainingCount";
import TotalTrainingSessionCount from "@/models/APIResponse/TotalTrainingSessionCount";

const TrainingSessionService = {
    async getDistributedLabel(): Promise<DistributedTrainingLabelResponse>{
        try{
            const response = await APIService.get<APIResponse<DistributedTrainingLabelResponse>>("/training/label");
            return {
                label_count : response.data.data.label_count
            }
        }catch{
            return { label_count : []}
        }
    },

    async getTotalTrainingSessionCount() : Promise<TotalTrainingCount|undefined>{
        try{
            const response = await APIService.get<APIResponse<TotalTrainingSessionCount>>("/training/count")
            const data = response.data.data
            return {
                total_pending : data.total_pending,
                total_trained : data.total_trained
            }
        }catch{
            return 
        }
    }
}

export default TrainingSessionService;