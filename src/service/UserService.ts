import APIResponse from "@/models/APIResponse/APIResponse";
import APIService from "./APIService";
import { UserStatisticResponse } from "@/models/APIResponse/UserStatisticResponse";
import { ServiceCallback } from "@/models/ServiceCallback";
import UserData from "@/models/domain/UserData";
import UserResponse from "@/models/APIResponse/UserResponse";
import UserRequest from "@/models/APIRequest/UserRequest";
import axios from "axios";

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
    },

    async createNewuser(userData : UserRequest):Promise<APIResponse<null>>{
        try{
            const response = await APIService.post<APIResponse<null>>("/auth/register", userData)
            const data = response.data;
            return data
        }catch (exception) {
            if (axios.isAxiosError(exception)) {
                const serverStatus = exception.response?.status;
                const serverMessage = exception.response?.data?.message;

                return {
                    status: serverStatus || 500,
                    message: serverMessage || "Terjadi kesalahan pada server",
                    data: null
                };
            }

        return {
            status: 500,
            message: "Internal Client Error",
            data: null
        };
    }
    },

    async updateUserData(userData : UserRequest):Promise<APIResponse<null>>{
        try{
            const response = await APIService.put<APIResponse<null>>("/users", userData)
            const data = response.data;
            return data
        }catch (exception) {
            if (axios.isAxiosError(exception)) {
                const serverStatus = exception.response?.status;
                const serverMessage = exception.response?.data?.message;

                return {
                    status: serverStatus || 500,
                    message: serverMessage || "Terjadi kesalahan pada server",
                    data: null
                };
            }

        return {
            status: 500,
            message: "Internal Client Error",
            data: null
        };
    }
    },

    async deleteUserData(id : string): Promise<APIResponse<null>>{
        try{
            const response = await APIService.delete<APIResponse<null>>("/users?id="+id)
            const data = response.data;
            return data
        }catch (exception) {
            if (axios.isAxiosError(exception)) {
                const serverStatus = exception.response?.status;
                const serverMessage = exception.response?.data?.message;

                return {
                    status: serverStatus || 500,
                    message: serverMessage || "Terjadi kesalahan pada server",
                    data: null
                };
            }

            return {
                status: 500,
                message: "Internal Client Error",
                data: null
            };
        }
    }
 
}

export default UserService;