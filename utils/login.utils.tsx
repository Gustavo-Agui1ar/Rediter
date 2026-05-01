
export class LoginValidator {
  /**
   * Valida se o e-mail informado possui um formato válido.
   *
   * @param email E-mail a ser validado
   * @returns true caso o e-mail seja válido
   */
  static isEmailValid(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida se a senha atende aos critérios mínimos:
   * - Pelo menos 6 caracteres
   * - Uma letra maiúscula
   * - Uma letra minúscula
   * - Um número
   *
   * @param password Senha a ser validada
   * @returns true caso a senha seja válida
   */
  static isPasswordValid(password: string) {
    if (password.length < 6) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;

    return true;
  }

  /**
   * Verifica se as senhas informadas são iguais.
   *
   * @param password Senha principal
   * @param confirmPassword Senha de confirmação
   * @returns true caso as senhas coincidam
   */
  static doPasswordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }

  /**
   * Extrai os tokens de autenticação da resposta da API.
   *
   * @param response Resposta HTTP contendo os tokens
   * @returns Objeto contendo accessToken e refreshToken
   */
  static async ParseTokens(response: Response) {
    var tokens = await response.json();

    var refresh = tokens.refreshToken;
    var access = tokens.accessToken;

    return { refresh, access };
  }
}

/**
 * Atualiza dinamicamente um campo de um estado React.
 *
 * @template T Tipo do estado
 * @param setState Função de atualização do estado
 * @param field Campo que será atualizado
 * @param value Novo valor do campo
 */
export function updateField<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: any,
) {
  setState((prev) => ({
    ...prev,
    [field]: value,
  }));
}
