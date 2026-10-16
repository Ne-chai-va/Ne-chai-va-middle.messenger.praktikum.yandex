const REGEX_PATTERNS = {
  name: /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/,
  login: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,40}$/,
  phone: /^\+?[0-9]{10,15}$/,
  message: /[\s\S]+/,
};

export type ValidationType = keyof typeof REGEX_PATTERNS;

export function validateField(type: ValidationType, value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Поле не должно быть пустым";
  }

  const regex = REGEX_PATTERNS[type];
  if (!regex.test(trimmedValue)) {
    switch (type) {
      case "name":
        return "Первая буква заглавная, без пробелов, цифр и спецсимволов (кроме дефиса)";
      case "login":
        return "3–20 символов, латиница, цифры, дефис, '_'. Не может состоять только из цифр";
      case "email":
        return "Латиница, цифры и спецсимволы. Обязательна @ и буквы перед точкой";
      case "password":
        return "8–40 символов, обязательно минимум одна заглавная буква и одна цифра";
      case "phone":
        return "10–15 символов, только цифры, может начинаться с '+'";
      case "message":
        return "Сообщение не должно быть пустым";
      default:
        return "Некорректное значение";
    }
  }

  return "";
}
