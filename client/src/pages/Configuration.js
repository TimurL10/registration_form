import React, { useMemo, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setSelected as setSelectedAction } from "../store/optionsSlice.js";
import { Link} from "react-router-dom";
import { toast } from "react-toastify";



export default function Configuration({
  allOptions = [ "Имя",
  "Фамилия",
  "Отчество",
  "ФИО",
  "Дата рождения",
  "Пол",
  "Гражданство",
  "Адрес проживания",
  "Адрес регистрации",
  "Город",
  "Почтовый индекс",

  // Контактные данные
  "Телефон",
  "Рабочий телефон",
  "Электронная почта",
  "Корпоративная почта",
  "Личный сайт / LinkedIn / профиль в соцсети",

  // Рабочие данные
  "Должность",
  "Рабочая должность (англ.)",
  "Отдел / подразделение / департамент",
  "Компания",
  "Офис",
  "Кабинет / номер рабочего места",
  "Руководитель / прямой начальник",
  "Табельный номер / внутренний ID",
  "Дата приёма на работу",
  "Тип занятости (штатный / контракт / стажёр)",
  "Уровень доступа / роль в системе",
  "Номер пропуска / карты доступа","Личное Фото","Загрузить документ"],  

  onSubmit = (payload) => console.log("Submit payload:", payload),
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // array of strings
  const [bannerFile, setBannerFile] = useState(null);
  const [clientDocFile, setClientDocFile] = useState(null);
  const [customOption, setCustomOption] = useState("");
  const v_companyId = useSelector((state) => state.options.companyId);

  const handleSave = async () => {
    await fetch("http://localhost:4000/api/form-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: v_companyId, fields: selected }),
    });
  };


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allOptions.filter((o) => o.toLowerCase().includes(q)) : allOptions;
  }, [allOptions, query]);

  const toggleOption = (opt) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const removeSelected = (opt) => setSelected((prev) => prev.filter((x) => x !== opt));

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("handleSubmit: старт", selected);
  try {
    await handleSave();                        // ждём сервер
    dispatch(setSelectedAction(selected));     // redux
    toast.success("Данные успешно отправлены!");
    onSubmit?.({ selectedOptions: selected, bannerFile, clientDocFile });
  } catch (err) {
    console.error("handleSubmit error:", err);
    toast.error("Ошибка при сохранении");
  }
};

  const handleAddCustomOption = () => {
    const opt = customOption.trim();
    if (!opt) return;
    if (!selected.includes(opt)) {
      setSelected((prev) => [...prev, opt]);
    }
    setCustomOption("");
  };

  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Форма выбора полей для формы регистрации</h1>
          <p className="text-gray-500 mt-1">Выбери нужные поля.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Options source */}
            <section className="border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск опций..."
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-lg border px-3 py-2 hover:bg-gray-50"
                >
                  Сброс
                </button>
              </div>

              <div className="max-h-64 overflow-auto divide-y rounded-lg border">
                {filtered.length === 0 && (
                  <div className="p-4 text-gray-400">Ничего не найдено</div>
                )}
                {filtered.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <label key={opt} className="flex items-center justify-between gap-4 p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleOption(opt)}
                          className="h-4 w-4"
                        />
                        <span className="select-none">{opt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleOption(opt)}
                        className={`text-sm rounded-lg px-3 py-1.5 border ${
                          active ? "bg-indigo-600 text-white border-indigo-600" : "hover:bg-gray-100"
                        }`}
                      >
                        {active ? "Выбрано" : "Выбрать"}
                      </button>
                    </label>
                  );
                })}
              </div>

              {/* Custom option adder */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={customOption}
                  onChange={(e) => setCustomOption(e.target.value)}
                  placeholder="Добавить свою опцию"
                  className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomOption}
                  className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
                >
                  Добавить
                </button>
              </div>
            </section>

            {/* RIGHT: Mirrored (chosen) */}
            <section className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">Выбранные опции</h2>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50"
                  >
                    Очистить
                  </button>
                )}
              </div>

              {selected.length === 0 ? (
                <div className="p-4 text-gray-400 border rounded-lg">Пока пусто. Выбери опции слева.</div>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {selected.map((opt) => (
                    <li key={opt} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-full">
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() => removeSelected(opt)}
                        className="rounded-full border px-2 text-xs hover:bg-white"
                        aria-label={`Удалить ${opt}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}             
            </section>

            {/* Footer */}
            <div className="lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Выбрано: <span className="font-medium text-gray-700">{selected.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                    <Link to="/registrationform">Посмотреть форму</Link>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected([]);
                    setBannerFile(null);
                    setClientDocFile(null);
                  }}
                  className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                >
                  Сбросить
                </button>
                <button
                  type="submit" onClick={() => console.log('клик по submit')}
                  className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={selected.length === 0}                  
                >
                  Отправить
                </button>
              </div>
            </div>
          </form>          
        </div>
      </div>
    </div>
    
  );
}
