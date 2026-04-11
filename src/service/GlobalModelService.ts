import APIService from "./APIService";
import {GlobalModelResponse} from "../models/APIResponse/GlobalModelResponse";
import GlobalModelInfo  from "@/models/domain/GlobalModelInfo";
import APIResponse from "../models/APIResponse/APIResponse";


const GlobalModelService = {
  async getGlobalModelInfo(onSuccess?: (data: GlobalModelInfo) => void): Promise<GlobalModelInfo> {
    try {
      const response = await APIService.get<APIResponse<GlobalModelInfo>>("/model/info");
      const rawData = response.data.data;

      const formattedData: GlobalModelInfo = {
        id: rawData.id,
        model_name: rawData.model_name,
        model_version: rawData.model_version,
        last_updated: rawData.last_updated,
        accuracy : rawData.accuracy
      };

      if (onSuccess) {
        onSuccess(formattedData);
      }

      return formattedData;
    } catch (error: any) {
      console.error("Error fetching global model:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch global model data");
    }
  },

};

export default GlobalModelService;