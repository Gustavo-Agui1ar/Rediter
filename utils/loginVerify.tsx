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
}
