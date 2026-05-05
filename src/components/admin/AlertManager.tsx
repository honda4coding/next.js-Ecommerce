'use client';

import { useState, useEffect } from 'react';
import { deleteAllNotifications, deleteNotification } from '@/src/actions/notificationActions';

export default function AlertManager() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<{ _id: string, msg: string, time: string }[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.notifications) {
        setLogs(data.notifications.map((n: any) => ({
          _id: n._id,
          msg: n.message,
          time: new Date(n.createdAt).toLocaleTimeString('en-US')
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClear = async () => {
    setLoading(true);
    try {
      await deleteAllNotifications();
      setLogs([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    setLoading(true);
    try {
      await deleteNotification(id);
      setLogs(logs.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.toUpperCase() }),
      });
      if (res.ok) {
        await fetchLogs();
        setMessage('');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="mb-16 px-2 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2 leading-none">Alerts</h1>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">Send announcements to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="border-4 border-black dark:border-white p-12 bg-white dark:bg-black">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-10 border-b border-black dark:border-white pb-4 inline-block">Create New Alert</h2>
          <form onSubmit={handleBroadcast} className="space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message Content</label>
              <textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-transparent border-b-4 border-black dark:border-white py-6 text-3xl font-bold focus:outline-none uppercase min-h-[180px] resize-none"
                placeholder="Type your message here..."
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-8 text-[12px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
            >
              {loading ? 'Sending...' : 'Send Alert'}
            </button>
          </form>
        </div>

        <div className="border-4 border-black dark:border-white p-12 bg-white dark:bg-black overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-10 border-b border-black dark:border-white pb-4">
            <h2 className="text-xl font-black uppercase tracking-tighter">Alert History</h2>
            <button 
              onClick={handleClear}
              disabled={loading || logs.length === 0}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all px-4 py-2 border-2 border-red-500 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={log._id || i} className="border-b-2 border-zinc-100 dark:border-zinc-900 pb-6 group flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors pr-4">{log.msg}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Time: {log.time}</p>
                </div>
                <button
                  onClick={() => handleDeleteSingle(log._id)}
                  disabled={loading}
                  className="text-[10px] font-black text-red-500 hover:opacity-50 transition-opacity uppercase tracking-widest shrink-0"
                >
                  Delete
                </button>
              </div>
            )) : (
              <p className="text-[11px] font-black text-zinc-300 uppercase tracking-widest opacity-50">No alerts sent yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
