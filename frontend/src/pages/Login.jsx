import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { apiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="panel w-full max-w-md p-8">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Access your team workspace and assigned work.</p>
        </div>
        <div className="space-y-4">
          <Alert message={error} />
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input className="input mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here? <Link className="font-semibold text-blue-600" to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
