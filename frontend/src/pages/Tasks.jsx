import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { apiError } from '../api/client';
import Alert from '../components/Alert';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

export default function Tasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    const params = {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(projectId && { projectId }),
    };
    api.get('/tasks', { params })
      .then(({ data }) => setTasks(data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filters.status, filters.priority, projectId]);

  const updateStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task.id}`, { status });
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <div className="space-y-5">
      {!projectId && (
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Filter, sort, and update task status.</p>
        </div>
      )}
      <Alert message={error} />
      <div className="panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        <p className="text-sm font-semibold text-slate-500">Sorted by due date</p>
      </div>

      {loading ? <Spinner label="Loading tasks" /> : tasks.length === 0 ? (
        <EmptyState title="No tasks found" detail="Try another filter or create a task inside a project." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Assignee</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className={task.overdue ? 'bg-red-50/80' : 'bg-white'}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 max-w-xl text-xs text-slate-500">{task.description}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{task.assignedUser.name}</td>
                    <td className="px-5 py-4"><StatusBadge value={task.status} /></td>
                    <td className="px-5 py-4"><PriorityBadge value={task.priority} /></td>
                    <td className={`px-5 py-4 font-medium ${task.overdue ? 'text-red-700' : 'text-slate-600'}`}>{task.dueDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select className="input min-w-36" defaultValue={task.status} onChange={(e) => updateStatus(task, e.target.value)}>
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <Save className="text-slate-400" size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
