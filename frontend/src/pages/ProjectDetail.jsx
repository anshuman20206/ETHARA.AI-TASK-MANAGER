import { Plus, UserRoundPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { apiError } from '../api/client';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import Tasks from './Tasks';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedUserId: '' });
  const [memberIds, setMemberIds] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/projects'), api.get('/users')])
      .then(([projectRes, userRes]) => {
        setProjects(projectRes.data);
        setUsers(userRes.data);
      })
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const project = useMemo(() => projects.find((item) => String(item.id) === String(projectId)), [projects, projectId]);
  const nonMembers = users.filter((user) => !project?.members.some((member) => member.id === user.id));

  const addMembers = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/projects/${projectId}/members`, { userIds: memberIds.map(Number) });
      setMemberIds([]);
      setShowMemberForm(false);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, projectId: Number(projectId), assignedUserId: Number(taskForm.assignedUserId) });
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedUserId: '' });
      setShowTaskForm(false);
      setRefreshKey((value) => value + 1);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading project" />;
  if (!project) return <EmptyState title="Project not found" detail="Return to projects and select another workspace." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link className="text-sm font-semibold text-blue-600" to="/projects">Back to projects</Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">{project.name}</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{project.description || 'No description provided.'}</p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setShowMemberForm((value) => !value)}><UserRoundPlus size={18} />Add Members</button>
            <button className="btn-primary" onClick={() => setShowTaskForm((value) => !value)}><Plus size={18} />Create Task</button>
          </div>
        )}
      </div>
      <Alert message={error} />

      <section className="panel p-5">
        <h2 className="font-bold text-slate-950">Members</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.members.map((member) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700" key={member.id}>{member.name} - {member.role}</span>
          ))}
        </div>
      </section>

      {showMemberForm && (
        <form onSubmit={addMembers} className="panel space-y-4 p-5">
          <h2 className="font-bold text-slate-950">Add project members</h2>
          {nonMembers.length === 0 ? <EmptyState title="Everyone is already a member" detail="New users will appear here after signup." /> : (
            <>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {nonMembers.map((user) => (
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700" key={user.id}>
                    <input type="checkbox" value={user.id} checked={memberIds.includes(String(user.id))} onChange={(e) => {
                      setMemberIds((ids) => e.target.checked ? [...ids, e.target.value] : ids.filter((id) => id !== e.target.value));
                    }} />
                    {user.name} <span className="text-xs text-slate-400">{user.role}</span>
                  </label>
                ))}
              </div>
              <button className="btn-primary" disabled={memberIds.length === 0}>Add selected</button>
            </>
          )}
        </form>
      )}

      {showTaskForm && (
        <form onSubmit={createTask} className="panel grid gap-4 p-5 lg:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Title
            <input className="input mt-1" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Assignee
            <select className="input mt-1" value={taskForm.assignedUserId} onChange={(e) => setTaskForm({ ...taskForm, assignedUserId: e.target.value })} required>
              <option value="">Select member</option>
              {project.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700 lg:col-span-2">
            Description
            <textarea className="input mt-1 min-h-24" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Priority
            <select className="input mt-1" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Due date
            <input className="input mt-1" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} required />
          </label>
          <div className="lg:col-span-2">
            <button className="btn-primary">Create task</button>
          </div>
        </form>
      )}

      <Tasks key={refreshKey} projectId={projectId} />
    </div>
  );
}
