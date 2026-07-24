import { useState } from "react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import QueueList from "@/components/dashboard/QueueList";
import QueueWorkspace from "@/components/dashboard/QueueWorkspace";
import type { Queue } from "@/services/queue.service";
import { queueService } from "@/services/queue.service";

export default function Dashboard() {
  const [selectedQueue, setSelectedQueue] = useState<Queue>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const refresh = () => setRefreshKey((key) => key + 1);
  const createQueue = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setCreating(true);
      setError("");
      const queue = await queueService.createQueue(name, description || undefined);
      setSelectedQueue(queue);
      setShowCreate(false);
      setName("");
      setDescription("");
      refresh();
      toast.success("Queue created successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create the queue.");
      toast.error(err.response?.data?.message || "Could not create the queue.");
    } finally {
      setCreating(false);
    }
  };

  return <div className="app-shell min-h-screen"><DashboardHeader />
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-indigo-600">OVERVIEW</p><h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Keep your day moving.</h2><p className="mt-2 text-slate-500 dark:text-slate-400">Manage every line from one calm, focused workspace.</p></div><div className="rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400"><span className="font-semibold text-slate-800 dark:text-white">Today</span> · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div></section>
      <StatsCards />
      <section className="glass-panel mt-10 rounded-3xl border border-white/80 bg-white/90 p-5 sm:p-7 dark:border-white/10 dark:bg-slate-900/80"><div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-500">YOUR QUEUES</p><h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Service lines</h2></div><button onClick={() => setShowCreate(true)} className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl">+ New queue</button></div><QueueList selectedId={selectedQueue?.id} onSelect={setSelectedQueue} refreshKey={refreshKey} /></section>
      {selectedQueue && <QueueWorkspace key={selectedQueue.id} queue={selectedQueue} onChanged={refresh} onDeleted={() => { setSelectedQueue(undefined); refresh(); }} />}
    </main>
    {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"><form onSubmit={createQueue} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600">New service line</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Create a queue</h2><p className="mt-2 text-sm text-slate-500">Give your visitors a clear place in line.</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="mt-6 block text-sm font-semibold text-slate-700">Queue name<input autoFocus required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="e.g. General consultation" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span><textarea maxLength={250} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="A short note about this queue" /></label><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => { setShowCreate(false); setError(""); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={creating} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50">{creating ? "Creating…" : "Create queue"}</button></div></form></div>}
  </div>;
}
