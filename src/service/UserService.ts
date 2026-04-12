import APIResponse from "@/models/APIResponse/APIResponse";
import APIService from "./APIService";
import { UserStatisticResponse } from "@/models/APIResponse/UserStatisticResponse";
import { ServiceCallback } from "@/models/ServiceCallback";
import UserData from "@/models/domain/UserData";
import UserResponse from "@/models/APIResponse/UserResponse";

const UserService = {
    async getUserStatistics(callback : ServiceCallback<UserStatisticResponse>){
        try{
            let response = await APIService.get<APIResponse<UserStatisticResponse>>("/users/count");
            if(response.data && response.data.data){
                callback.onSuccess(response.data.data);
            }else{
                callback.onError("Failed to fetch user statistics: Invalid response format");
            }
        }catch{
            callback.onError("Failed to fetch user statistics");
        }
    },

    async getAllUserData():Promise<Array<UserData>|undefined>{
        try{
            const response = await APIService.get<APIResponse<Array<UserResponse>>>("/users");
            const data = response.data.data
            return data
        }catch{
            return
        }
    }
}

export default UserService;