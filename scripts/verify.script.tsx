import { useLoading } from "@/context/loadingContext";
import { LoginValidator } from "@/utils/loginVerify";
import { request } from "@/utils/request";

export class ScriptVerify {
  static async verifyCode(userId: string, code: string) {
    var response = {
      error: "",
      success: false,
      refresh: "",
      access: "",
    };

    if (code.length !== 6) {
      alert("Código deve conter 6 dígitos.");
      return;
    }

    try {
      const serverResponse = await request({
        urlComplement: `/Auth/Code?code=${code}&userId=${userId}`,
        method: "GET",
        setLoading: useLoading,
      });

      if (serverResponse.ok) {
        {
          (response.refresh, response.access);
        }
        await LoginValidator.ParseTokens(serverResponse);
        response.success = true;
        return response;
      }
    } catch (error) {
      response.error = "Erro de rede. Tente novamente.";
      return response;
    }
  }
}
