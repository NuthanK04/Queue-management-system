import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { queueService, type Queue } from "@/services/queue.service";

type Props = { selectedId?: string; onSelect: (queue: Queue) => void; refreshKey: number };

export default function QueueList({ selectedId, onSelect, refreshKey }: Props) {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); queueService.getQueues().then(setQueues).catch(console.error).finally(() => setLoading(false)); }, [refreshKey]);
  if (loading) return <div className="grid place-items-center py-16 text-slate-400"><Loader2 className="animate-spin" /><span className="mt-3 text-sm">Loading your queues…</span></div>;
  if (!queues.length) return <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-indigo-500 shadow-sm"><Inbox size={23} /></span><p className="mt-4 font-bold text-slate-800">No queues yet</p><p className="mt-1 text-sm text-slate-500">Create your first service line to begin.</p></div>;
  return <div className="grid gap-3 lg:grid-cols-2">{queues.map((queue, index) => <button key={queue.id} onClick={() => onSelect(queue)} className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${selectedId === queue.id ? "border-indigo-400 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-100" : "border-slate-100 bg-slate-50/60 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"}`}><span className={`grid size-11 shrink-0 place-items-center rounded-xl font-bold ${selectedId === queue.id ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 shadow-sm"}`}>{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block truncate font-bold text-slate-800">{queue.name}</span><span className="mt-1 block truncate text-sm text-slate-500">{queue.description || "Ready to welcome visitors"}</span><span className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">Created {new Date(queue.createdAt).toLocaleDateString()} <ArrowUpRight size={12} /></span></span><ChevronRight className={`shrink-0 ${selectedId === queue.id ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-500"}`} /></button>)}</div>;
}
