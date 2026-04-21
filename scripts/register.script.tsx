import { LoginValidator } from "@/utils/login.utils";
import { request } from "@/utils/request.utils";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class ScriptRegister {
  static async sendRegisterRequest(form: RegisterForm) {
    var response = {
      error: "",
      success: false,
      userId: "",
    };
    response.error = "";

    if (!LoginValidator.isEmailValid(form.email)) {
      response.error = "Por favor, insira um e-mail válido.";
      return response;
    }

    if (!LoginValidator.isPasswordValid(form.password)) {
      response.error = "Por favor, insira uma senha válida.";
      return response;
    }

    if (!LoginValidator.doPasswordsMatch(form.password, form.confirmPassword)) {
      response.error = "Por favor, insira senhas coincidentes.";
      return response;
    }

    try {
      const user = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      const serverResponse = await request({
        urlComplement: "/User/Register",
        method: "PUT",
        body: user,
      });

      if (serverResponse.ok) {
        const data = await serverResponse.json();
        response.success = true;
        response.userId = data.userId;
      } else {
        response.error =
          "Falha ao registrar usuário. Verifique se o e-mail já existe.";
      }
      return response;
    } catch (error: any) {
      if (error.name === "AbortError") {
        response.error = "O servidor demorou muito para responder (Timeout).";
      } else {
        response.error = "Erro de conexão com o servidor.";
      }
      return response;
    }
  }
}
