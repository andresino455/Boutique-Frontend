import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form);
      if (result?.success) {
        navigate('/products');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al iniciar sesión.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
