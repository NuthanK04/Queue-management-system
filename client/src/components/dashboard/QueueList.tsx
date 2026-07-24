import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, Inbox, Loader2, Search } from "lucide-react";
import { queueService, type Queue } from "@/services/queue.service";

type Props = { selectedId?: string; onSelect: (queue: Queue) => void; refreshKey: number };

export default function QueueList({ selectedId, onSelect, refreshKey }: Props) {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    queueService
      .getQueues()
      .then(setQueues)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filteredQueues = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return queues;
    return queues.filter((queue) =>
      [queue.name, queue.description ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [filter, queues]);

  if (loading)
    return (
      <div className="grid place-items-center py-16 text-slate-400">
        <Loader2 className="animate-spin" />
        <span className="mt-3 text-sm">Loading your queues…</span>
      </div>
    );

  if (!queues.length)
    return (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 py-14 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-indigo-500 shadow-sm">
          <Inbox size={23} />
        </span>
        <p className="mt-4 font-bold text-slate-800">No queues yet</p>
        <p className="mt-1 text-sm text-slate-500">Create your first service line to begin.</p>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Find a queue</p>
          <p className="text-sm text-slate-400">Search by name or description.</p>
        </div>
        <div className="relative w-full max-w-sm sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Search queues"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      {filteredQueues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center text-slate-500">
          <p className="font-semibold text-slate-900">No queues match that search.</p>
          <p className="mt-2 text-sm">Try a different queue name or description.</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredQueues.map((queue, index) => {
            const waitingCount = queue._count?.tokens ?? 0;
            return (
              <button
                key={queue.id}
                onClick={() => onSelect(queue)}
                className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                  selectedId === queue.id
                    ? "border-indigo-400 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-100"
                    : "border-slate-100 bg-slate-50/60 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl font-bold ${
                    selectedId === queue.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-600 shadow-sm"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="block truncate text-base font-bold text-slate-900">{queue.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        waitingCount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {waitingCount} waiting
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm text-slate-500">{queue.description || "Ready to welcome visitors"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Created {new Date(queue.createdAt).toLocaleDateString()}</span>
                    <span className="inline-flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      {waitingCount > 0 ? "Active" : "Empty"}
                    </span>
                  </div>
                </span>
                <ChevronRight
                  className={`shrink-0 ${selectedId === queue.id ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-500"}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
