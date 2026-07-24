import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardStats } from "@/services/dashboard.service";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQueues: 0,
    waitingTokens: 0,
    servedTokens: 0,
    averageWaitMinutes: 0,
    queueTrend: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">Loading...</div>
        <div className="rounded-xl bg-white p-6 shadow">Loading...</div>
        <div className="rounded-xl bg-white p-6 shadow">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-600">
          Total Queues
        </h2>

        <p className="mt-4 text-5xl font-bold text-blue-600">
          {stats.totalQueues}
        </p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-600">Average Wait</h2>
        <p className="mt-4 text-5xl font-bold text-violet-600">{stats.averageWaitMinutes}<span className="ml-1 text-xl">min</span></p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow lg:col-span-4">
        <div className="mb-4"><h2 className="text-lg font-semibold text-slate-700">Queue activity</h2><p className="text-sm text-slate-500">Tokens added over the last 7 days</p></div>
        <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.queueTrend}><XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="tokensAdded" name="Tokens added" fill="#2563eb" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-600">
          Waiting Tokens
        </h2>

        <p className="mt-4 text-5xl font-bold text-yellow-500">
          {stats.waitingTokens}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-600">
          Served Tokens
        </h2>

        <p className="mt-4 text-5xl font-bold text-green-600">
          {stats.servedTokens}
        </p>
      </div>
    </div>
  );
}
