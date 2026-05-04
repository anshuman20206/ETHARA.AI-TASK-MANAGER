import { FolderKanban, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/projects')
      .then(({ data }) => setProjects(data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Open a project to manage its members and tasks.</p>
        </div>
        {isAdmin && <button className="btn-primary" onClick={() => setShowForm((value) => !value)}><Plus size={18} />Create Project</button>}
      </div>
      <Alert message={error} />
      {showForm && (
        <form onSubmit={create} className="panel grid gap-4 p-5 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <label className="text-sm font-semibold text-slate-700">
            Name
            <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Description
            <input className="input mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <button className="btn-primary">Create</button>
        </form>
      )}
      {loading ? <Spinner label="Loading projects" /> : projects.length === 0 ? (
        <EmptyState title="No projects yet" detail="Admins can create projects and add team members." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link to={`/projects/${project.id}`} className="panel block p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg" key={project.id}>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <FolderKanban size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-950">{project.name}</h2>
              <p className="mt-2 min-h-10 text-sm text-slate-500">{project.description || 'No description provided.'}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>{project.members.length} members</span>
                <span>{project.taskCount} tasks</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
