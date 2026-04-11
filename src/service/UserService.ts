import { APIResponse } from "@/models/APIResponse/APIResponse";
import APIService from "./APIService";
import { UserStatisticResponse } from "@/models/APIResponse/UserStatisticResponse";
import { ServiceCallback } from "@/models/ServiceCallback";

const UserService = {
    async getUserStatistics(callback : ServiceCallback<UserStatisticResponse>){
        try{
            let response = await APIService.get<APIResponse<UserStatisticResponse>>("/users");
            if(response.data && response.data.data){
                callback.onSuccess(response.data.data);
            }else{
                callback.onError("Failed to fetch user statistics: Invalid response format");
            }
        }catch{
            callback.onError("Failed to fetch user statistics");
        }
    }
}

export default UserService;