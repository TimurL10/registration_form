import { useState } from "react";
import './Index.css';
import { Link,useNavigate} from "react-router-dom";
import { setSelected } from "./optionsSlice";
import {useSelector} from "react-redux";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const options = useSelector((state) => state.options.selected);

  const hasOptions = Array.isArray(options) && options.length > 0;

  // обработка изменения любого поля
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Ошибка при отправке");

      alert("Форма успешно отправлена!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      {/* Баннер */}
      <div className="relative w-full h-60 md:h-65 rounded-2xl overflow-hidden">
        <img
          src="/register-now-banner.png"   
          className="absolute inset-0 w-full h-full object-cover"
        />       
        <div className="absolute bottom-3 left-4 text-white text-2xl font-semibold tracking-wide">
        </div>
      </div>

      {/* Форма */}
      <form className="flex flex-col gap-3 w-full bg-white p-6 rounded-2xl shadow">
      {hasOptions ? (options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          name={opt}
          placeholder={opt}
          className="border rounded p-2"
        />
      ))) :
      (
        <>
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            className="border rounded p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded p-2"
          />
          <textarea
            name="message"
            placeholder="Сообщение"
            className="border rounded p-2"
          />
        </>
      )
      }
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Отправить
        </button>
      </form>
      <p>
      <Link to="/configuration">Настроить форму</Link>
      </p>
    </div>
  </div>
);

}


