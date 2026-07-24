import { useEffect, useState } from "react";
import { queueService } from "@/services/queue.service";
import type { Queue } from "@/services/queue.service";

type Props = { selectedId?: string; onSelect: (queue: Queue) => void; refreshKey: number };

export default function QueueList({ selectedId, onSelect, refreshKey }: Props) {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQueues() {
      try {
        const data = await queueService.getQueues();
        setQueues(data);
      } catch (error) {
        console.error("Failed to fetch queues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQueues();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-slate-500">
          Loading queues...
        </p>
      </div>
    );
  }

  if (queues.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-300 py-16 text-center">
        <p className="text-lg text-slate-500">
          No queues available yet.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Click "Create Queue" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {queues.map((queue) => (
        <div
          key={queue.id}
          onClick={() => onSelect(queue)}
          className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${selectedId === queue.id ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {queue.name}
              </h3>

              <p className="mt-1 text-slate-500">
                {queue.description || "No description"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="font-medium">
                {new Date(queue.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
