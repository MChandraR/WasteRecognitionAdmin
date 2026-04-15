import axios
 from "axios"


interface handlerType {
    status : number,
    message : string,
    data : null
}

export default function HandleAxiosException(exception: unknown, result : (data : handlerType)=>void) {
    if (axios.isAxiosError(exception)) {
        const serverStatus = exception.response?.status;
        const responseData = exception.response?.data;

        // Logika ekstraksi pesan error yang fleksibel
        let errorMessage = "Terjadi kesalahan pada server";

        if (responseData) {
            if (typeof responseData === 'string') {
                errorMessage = responseData;
            } else if (responseData.message) {
                errorMessage = responseData.message;
            } else if (responseData.detail) {
                // Menangani error validasi FastAPI (Pydantic)
                // detail bisa berupa string atau array of objects
                if (Array.isArray(responseData.detail)) {
                    errorMessage = responseData.detail[0]?.msg || "Format data tidak valid";
                } else {
                    errorMessage = responseData.detail;
                }
            }
        }

        result({
            status: serverStatus || 500,
            message: errorMessage,
            data: null
        }) ;
    }

    // Menangani error non-Axios (misalnya network down atau error logic JS)
    result({
        status: 500,
        message: (exception as Error)?.message || "Koneksi ke server terputus",
        data: null
    });
}