"use client";

import { Activity } from "../../type/activity";

interface ActivityHistoryProps {
  activities: Activity[];
  loading: boolean;
}

export default function ActivityHistory({
  activities,
  loading,
}: ActivityHistoryProps) {
  if (loading) {
    return (
      <div className="bg-[#1F1F1F] p-6 rounded-xl border border-[#333333]">
        <p className="text-sm text-[#888]">Carregando histórico...</p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="bg-[#1F1F1F] p-6 rounded-xl border border-[#333333]">
        <p className="text-sm text-[#888]">
          Nenhuma atividade registrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1F1F1F] p-6 rounded-xl border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-[#E6C850]">
        Histórico de atividades
      </h3>

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center justify-between rounded-md border border-[#333333] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{activity.titulo}</p>
              <p className="text-xs text-[#777]">
                {new Date(activity.data).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                activity.status === "completed"
                  ? "bg-green-600/20 text-green-400"
                  : activity.status === "pending"
                  ? "bg-yellow-600/20 text-yellow-400"
                  : "bg-gray-600/20 text-gray-400"
              }`}
            >
              {activity.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
