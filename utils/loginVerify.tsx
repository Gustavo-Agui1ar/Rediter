export class LoginValidator {
  static isEmailValid(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPasswordValid(password: string) {
    if (password.length < 6) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[@$!%*?&]/.test(password)) return false;
    return true;
  }

  static doPasswordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }

  static async ParseTokens(response: Response) {
    var tokens = await response.json();
    var refresh = tokens.refreshToken;
    var access = tokens.accessToken;
    return { refresh, access };
  }
}

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
