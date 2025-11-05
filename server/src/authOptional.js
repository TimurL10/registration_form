// authOptional.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function authOptional(req, _res, next) {
  const hdr = req.headers.authorization;

  // нет заголовка → пользователь не залогинен
  if (!hdr) {
    req.user = null;
    return next();
  }

  const [type, token] = hdr.split(" ");

  if (type !== "Bearer" || !token) {
    req.user = null;
    return next();
  }

  try {
    // пытаемся распарсить токен
    const payload = jwt.verify(token, JWT_SECRET);

    // кладём данные в req.user
    req.user = {
      userId: payload.userId,
      companyId: payload.companyId,
      email: payload.email,
    };
  } catch {
    // токен битый или просроченный — просто считаем, что юзер гость
    req.user = null;
  }

  next();
}
