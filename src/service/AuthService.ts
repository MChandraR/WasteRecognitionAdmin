import APIService from "./APIService";
import {AuthResponse} from "../models/APIResponse/AuthResponse";
import {APIResponse} from "../models/APIResponse/APIResponse";
import { AuthRequest } from "@/models/APIRequest/AuthRequest";
import { useAuth } from "@/context/AuthContext";
import { ServiceCallback } from "@/models/ServiceCallback";

const AuthService = {

    async signIn(authRequest: AuthRequest, callback: ServiceCallback<AuthResponse>): Promise<APIResponse<AuthResponse>> {
        const response = await APIService.post<APIResponse<AuthResponse>>("/login", authRequest);
        if(response.data.status == 200) {
            callback.onSuccess(response.data.data);
        } else {
            callback.onError(response.data.message);
        }
        return response.data;
    }
};

export default AuthService;