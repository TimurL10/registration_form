import { useState } from "react";
import './Index.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

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
      <form className="flex flex-col gap-3 max-w-sm w-full bg-white p-6 rounded shadow">        
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Отправить
        </button>
      </form>
    </div>
  );
}


