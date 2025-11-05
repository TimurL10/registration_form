import { useState, useEffect } from "react";
import '../Index.css';
import { Link,useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import Spinner from "../components/Spinner.jsx";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const v_companyId = useSelector((state) => state.options.companyId);
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  //const options = useSelector((state) => state.options.selected);
  const hasOptions = Array.isArray(options) && options.length > 0;
  // обработка изменения любого поля
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
  (async () => {
    const res = await fetch(`http://localhost:4000/api/form-config?companyId=${v_companyId}`);
    const fields = await res.json();
    setOptions(fields);
    console.log('isArray:', Array.isArray(fields), 'typeof:', typeof fields, fields);
  })();
}, []);


  // отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
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
        <div className="py-6">
              <Spinner size={32} />
            </div>
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


