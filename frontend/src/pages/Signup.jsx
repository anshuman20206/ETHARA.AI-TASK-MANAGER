import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiError } from '../api/client';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
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
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Join as an admin or member for the demo workspace.</p>
        </div>
        <div className="space-y-4">
          <Alert message={error} />
          <label className="block text-sm font-semibold text-slate-700">
            Name
            <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input className="input mt-1" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Role
            <select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Sign up'}</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-semibold text-blue-600" to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
