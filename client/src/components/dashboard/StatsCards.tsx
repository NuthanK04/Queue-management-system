import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Clock3, ListOrdered, Users } from "lucide-react";
import { dashboardService, type DashboardStats } from "@/services/dashboard.service";

const emptyStats: DashboardStats = { totalQueues: 0, waitingTokens: 0, servedTokens: 0, averageWaitMinutes: 0, queueTrend: [] };
const cards = [
  { key: "totalQueues", label: "Live queues", description: "Ready for service", icon: ListOrdered, tone: "bg-indigo-50 text-indigo-600" },
  { key: "waitingTokens", label: "People waiting", description: "Across all queues", icon: Users, tone: "bg-amber-50 text-amber-600" },
  { key: "servedTokens", label: "People served", description: "Completed today", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  { key: "averageWaitMinutes", label: "Average wait", description: "Service response time", icon: Clock3, tone: "bg-violet-50 text-violet-600" },
] as const;

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  useEffect(() => { dashboardService.getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false)); }, []);
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(({ key, label, description, icon: Icon, tone }) => <div key={key} className="glass-panel rounded-2xl border border-white bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/80"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{loading ? "—" : stats[key]}{key === "averageWaitMinutes" && !loading && <span className="ml-1 text-base font-semibold text-slate-400">min</span>}</p><p className="mt-1 text-xs text-slate-400">{description}</p></div><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span></div></div>)}
    <div className="glass-panel rounded-2xl border border-white bg-white/90 p-5 sm:col-span-2 xl:col-span-4 dark:border-white/10 dark:bg-slate-900/80"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-bold text-slate-800 dark:text-white">Queue activity</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">New arrivals over the last seven days</p></div><span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">LAST 7 DAYS</span></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.queueTrend} margin={{ left: -20, right: 6 }}><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(15, 23, 42, .08)" }} /><Bar dataKey="tokensAdded" name="New arrivals" fill="#6366f1" radius={[7, 7, 3, 3]} /></BarChart></ResponsiveContainer></div></div>
  </div>;
}
