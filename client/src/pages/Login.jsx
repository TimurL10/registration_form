import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi, setTokens } from "../api/authClient";
import { useDispatch } from "react-redux";
import { setCompanyId } from "../store/optionsSlice.js";

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const res = await authApi("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (res.ok) {
      const data = await res.json();
      
      setTokens(data);              // { access_token, refresh_token }
      nav("/");        // защищённая страница
      dispatch(setCompanyId(data.user.companyId));
    } else {
      const err = await res.json().catch(() => ({ error: "server error" }));
      setMsg("Ошибка: " + (err.error || "server error"));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-3">
        <h1 className="text-xl font-semibold text-center">Вход</h1>

        <input
          className="w-full border rounded p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-3"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded p-3">
          Войти
        </button>

        <p className="text-center text-sm text-gray-600">
          Нет аккаунта? <Link to="/register" className="text-indigo-600">Регистрация</Link>
        </p>

        {msg && <div className="text-center text-sm text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
