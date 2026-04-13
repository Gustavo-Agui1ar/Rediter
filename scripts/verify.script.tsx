import { configs } from "@/utils/configs";
import { LoginValidator } from "@/utils/loginVerify";
import { useRequest } from "@/utils/request";

const { request } = useRequest();
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), configs.timeout);

    try {
      const serverResponse = await request(
        `/Auth/Code?code=${code}&userId=${userId}`,
        "GET",
        undefined,
        controller.signal,
      );

      clearTimeout(timeoutId);

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
