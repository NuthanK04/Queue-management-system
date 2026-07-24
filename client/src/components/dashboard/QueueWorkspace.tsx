import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { queueService, type Queue, type Token } from "@/services/queue.service";
import { tokenService } from "@/services/token.service";

type Props = { queue: Queue; onDeleted: () => void; onChanged: () => void };

export default function QueueWorkspace({ queue, onDeleted, onChanged }: Props) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const data = await queueService.getQueue(queue.id);
    setTokens(data.tokens.filter((token) => token.status === "WAITING").sort((a, b) => a.position - b.position));
  }, [queue.id]);

  useEffect(() => {
    void refresh().catch(() => setError("Could not load this queue."));
  }, [refresh]);

  const run = async (action: string, fn: () => Promise<void>, successMessage?: string) => {
    try {
      setBusy(action);
      setError("");
      await fn();
      await refresh();
      onChanged();
      if (successMessage) toast.success(successMessage);
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(null);
    }
  };

  const addPerson = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await run("add", async () => {
      await tokenService.addPerson(queue.id, name);
      setName("");
    }, "Visitor added to the queue");
  };
  return <section className="glass-panel mt-7 overflow-hidden rounded-3xl border border-white bg-white/95"><div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-white p-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Now managing</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{queue.name}</h2>{queue.description && <p className="mt-1.5 text-slate-500">{queue.description}</p>}</div><button onClick={() => { if (confirm(`Delete ${queue.name}? This removes all of its tokens.`)) void run("delete", async () => { await queueService.deleteQueue(queue.id); onDeleted(); }, "Queue deleted successfully"); }} disabled={busy === "delete"} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} />Delete queue</button></div><div className="p-5 sm:p-6"><form onSubmit={addPerson} className="flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="person-name">Visitor name</label><input id="person-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Enter a visitor's name" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" /><button disabled={busy === "add" || !name.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50">{busy === "add" ? <Loader2 className="animate-spin" size={17} /> : <UserPlus size={17} />} Add person</button></form>{error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="mt-6 overflow-hidden rounded-2xl border border-slate-200"><div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400"><span>#</span><span>Visitor</span><span>Actions</span></div>{tokens.length === 0 ? <p className="px-4 py-12 text-center text-slate-500">This queue is empty. Add the first person above.</p> : tokens.map((token, index) => <div key={token.id} className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-t border-slate-100 px-4 py-3 transition ${index === 0 ? "bg-emerald-50/40" : "hover:bg-slate-50/70"}`}><span className={`grid size-8 place-items-center rounded-lg text-sm font-bold ${index === 0 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>{index + 1}</span><div><p className="font-bold text-slate-800">{token.personName}{index === 0 && <span className="ml-2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Next</span>}</p><p className="text-xs text-slate-400">Joined {new Date(token.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div><div className="flex items-center gap-1"><button aria-label={`Move ${token.personName} up`} disabled={index === 0 || !!busy} onClick={() => void run(`up-${token.id}`, () => tokenService.moveUp(token.id), "Visitor moved up in line")} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowUp size={17} /></button><button aria-label={`Move ${token.personName} down`} disabled={index === tokens.length - 1 || !!busy} onClick={() => void run(`down-${token.id}`, () => tokenService.moveDown(token.id), "Visitor moved down in line")} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowDown size={17} /></button>{index === 0 && <button disabled={!!busy} onClick={() => void run(`serve-${token.id}`, () => tokenService.serve(token.id), "Visitor served")} className="ml-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">Serve</button>}<button aria-label={`Cancel ${token.personName}`} disabled={!!busy} onClick={() => void run(`cancel-${token.id}`, () => tokenService.cancel(token.id), "Visitor removed from queue")} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-30"><Trash2 size={16} /></button></div></div>)}</div></div></section>;
}
