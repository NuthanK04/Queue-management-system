import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Queue Management Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your queues efficiently 🚀
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
