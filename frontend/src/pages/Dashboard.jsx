import { AlertTriangle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api, { apiError } from '../api/client';
import Alert from '../components/Alert';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks')
      .then(({ data }) => setTasks(data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'DONE').length;
    const overdue = tasks.filter((task) => task.overdue).length;
    return [
      { label: 'Total tasks', value: tasks.length, icon: ListTodo, color: 'bg-blue-50 text-blue-700' },
      { label: 'Completed', value: completed, icon: CheckCircle2, color: 'bg-green-50 text-green-700' },
      { label: 'Pending', value: tasks.length - completed, icon: Clock, color: 'bg-slate-100 text-slate-700' },
      { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'bg-red-50 text-red-700' },
    ];
  }, [tasks]);

  const recent = tasks.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Live snapshot of team task progress.</p>
      </div>
      <Alert message={error} />
      {loading ? <Spinner label="Loading dashboard" /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article className="panel p-5" key={stat.label}>
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon size={22} />
                  </span>
                  <span className="text-3xl font-bold text-slate-950">{stat.value}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-600">{stat.label}</p>
              </article>
            ))}
          </section>

          <section className="panel overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold text-slate-950">Recent tasks</h2>
            </div>
            {recent.length === 0 ? <div className="p-5"><EmptyState title="No tasks yet" detail="Tasks will appear here after an admin creates them." /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Project</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Priority</th>
                      <th className="px-5 py-3">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((task) => (
                      <tr key={task.id} className={task.overdue ? 'bg-red-50/70' : 'bg-white'}>
                        <td className="px-5 py-4 font-semibold text-slate-900">{task.title}</td>
                        <td className="px-5 py-4 text-slate-600">{task.projectName}</td>
                        <td className="px-5 py-4"><StatusBadge value={task.status} /></td>
                        <td className="px-5 py-4"><PriorityBadge value={task.priority} /></td>
                        <td className="px-5 py-4 text-slate-600">{task.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
