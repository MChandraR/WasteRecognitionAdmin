
const GlobalModelService = {
  getGlobalModel: async () => {
    try {
      const response = await fetch("/api/global-model");
      if (!response.ok) {
        throw new Error("Failed to fetch global model data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching global model data:", error);
      return null;
    }
  }
};

export default GlobalModelService;