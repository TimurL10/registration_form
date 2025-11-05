// FormsDashboard.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FORM_TYPES = [
  { value: "registration", label: "Форма регистрации" },
  { value: "questionnaire", label: "Анкета" },
];

// Встроенный спиннер, чтобы без отдельного файла
function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export default function FormsDashboard() {
  const navigate = useNavigate();

  // забираем из redux
  const companyId = useSelector((s) => s.options.companyId);
  const accessToken = useSelector((s) => s.options?.accessToken); // если есть

  // создание формы
  const [title, setTitle] = useState("");
  const [type, setType] = useState(FORM_TYPES[0].value);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");

  // список форм
  const [forms, setForms] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listErr, setListErr] = useState("");

  // загрузить список форм компании
  const loadForms = async () => {
    if (!companyId) return;
    setLoadingList(true);
    setListErr("");
    try {
      const res = await fetch(`http://localhost:4000/api/form-config?companyId=${companyId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); // ожидаем массив: [{id, title, type, created_at}, ...]
      console.log("дата:", data);
      setForms(Array.isArray(data) ? data : []);
    } catch (e) {
      setListErr(e?.message || "Не удалось загрузить формы"); 
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // создать форму
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateErr("");

    if (!companyId) {
      setCreateErr("companyId отсутствует. Войдите заново.");
      return;
    }
    if (!title.trim()) {
      setCreateErr("Введите название формы.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          company_id: companyId,
          title: title.trim(),
          type,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); // { id, ... }
      // обновим список
      await loadForms();
      // и перейдём к конфигу
      navigate(`/configuration?formId=${data.id}`);
    } catch (e) {
      setCreateErr(e?.message || "Ошибка при создании");
    } finally {
      setCreating(false);
    }
  };

  const goEdit = (id) => navigate(`/configuration?formId=${id}`);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-5xl px-4">
        {/* Шапка */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Мои формы</h1>
          <p className="text-gray-500 text-sm">Создавайте и редактируйте публичные формы вашей компании</p>
        </div>

        {/* Блок создания */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Создать новую форму</h2>

          {createErr && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createErr}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-700">Название формы</label>
              <input
                type="text"
                placeholder="Например: Регистрация на вебинар"
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Тип</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {FORM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {creating && <Spinner size={18} />}
                {creating ? "Создаём..." : "Создать форму"}
              </button>
            </div>
          </form>
        </div>

        {/* Список форм */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Существующие формы</h2>
            {loadingList && <Spinner />}
          </div>

          {listErr && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {listErr}
            </div>
          )}

          {!loadingList && forms.length === 0 && (
            <div className="text-sm text-gray-500">Форм пока нет. Создайте первую выше 👆</div>
          )}

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((f) => (
              <li
                key={f.id}
                className="group cursor-pointer rounded-xl border border-gray-200 hover:border-blue-400 bg-white p-4 shadow-sm hover:shadow transition"
                onClick={() => goEdit(f.id)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{f.title}</h3>
                  <span className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                    {f.type === "registration" ? "Регистрация" : f.type === "questionnaire" ? "Анкета" : f.type}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  ID: <span className="font-mono">{f.id}</span>
                </div>
                {f.created_at && (
                  <div className="mt-1 text-xs text-gray-400">
                    Создана: {new Date(f.created_at).toLocaleString()}
                  </div>
                )}
                <div className="mt-3 text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition">
                  Перейти к настройке →
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* отладочная строка */}
        <div className="mt-4 text-xs text-gray-500">
          companyId: <span className="font-mono">{companyId ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
