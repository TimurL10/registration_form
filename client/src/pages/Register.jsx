import { useState } from "react";
import { authApi } from "../api/authClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await authApi("/auth/register", {
      method: "POST",
      body: { email, password, companyName },
    });

    if (res.ok) {
      setMsg("Регистрация успешна. Проверьте почту и подтвердите e-mail.");
      setEmail("");
      setPassword("");
      setCompanyName("");
    } else {
      const err = await res.json().catch(() => ({ error: "server error" }));
      setMsg("Ошибка: " + (err.error || "server error"));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-3">
        <h1 className="text-xl font-semibold text-center">Регистрация</h1>

        <input
          className="w-full border rounded p-3"
          placeholder="Компания"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-3"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded p-3">
          Зарегистрироваться
        </button>

        {msg && <div className="text-center text-sm text-gray-700">{msg}</div>}
      </form>
    </div>
  );
}
