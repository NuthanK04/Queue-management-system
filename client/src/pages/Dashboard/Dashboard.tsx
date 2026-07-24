import { useState } from "react";
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
    try { setCreating(true); setError(""); const queue = await queueService.createQueue(name, description || undefined); setSelectedQueue(queue); setShowCreate(false); setName(""); setDescription(""); refresh(); }
    catch (err: any) { setError(err.response?.data?.message || "Could not create the queue."); }
    finally { setCreating(false); }
  };
  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl p-8">
        {/* Dashboard Statistics */}
        <StatsCards />

        {/* Queue Section */}
        <section className="mt-10 rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Queues
            </h2>

            <button onClick={() => setShowCreate(true)} className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700">
              + Create Queue
            </button>
          </div>

          <QueueList selectedId={selectedQueue?.id} onSelect={setSelectedQueue} refreshKey={refreshKey} />
        </section>
        {selectedQueue && <QueueWorkspace key={selectedQueue.id} queue={selectedQueue} onChanged={refresh} onDeleted={() => { setSelectedQueue(undefined); refresh(); }} />}
      </main>
      {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={createQueue} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-xl font-bold text-slate-900">Create a queue</h2><p className="mt-1 text-sm text-slate-500">Add a queue for people waiting for service.</p>{error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}<label className="mt-5 block text-sm font-medium text-slate-700">Queue name<input autoFocus required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. General consultation" /></label><label className="mt-4 block text-sm font-medium text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span><textarea maxLength={250} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" placeholder="A short note about this queue" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => { setShowCreate(false); setError(""); }} className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{creating ? "Creating…" : "Create queue"}</button></div></form></div>}
    </div>
  );
}
