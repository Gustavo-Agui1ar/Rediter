import { LoginValidator } from "@/utils/loginVerify";
import { request } from "@/utils/request";

export class ScriptVerify {
  static async verifyCode(
    userEmail: string,
    code: string,
    setLoading?: (loading: boolean) => void,
  ) {
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
        urlComplement: `/Auth/Code?code=${code}&userEmail=${userEmail}`,
        method: "GET",
        setLoading: setLoading,
      });
      console.log("Server response:", serverResponse);
      if (serverResponse.ok) {
        {
          (response.refresh, response.access);
        }
        await LoginValidator.ParseTokens(serverResponse);
        response.success = true;
        return response;
      }
    } catch (error) {
      console.error("Error during code verification:", error);
      response.error = "Erro de rede. Tente novamente.";
      return response;
    }
  }
}
