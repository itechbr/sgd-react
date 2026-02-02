"use client";

import { useEffect, useState } from "react";
import { getActivities } from "../../services/profileService";

type Activity = {
  id: string;
  description: string;
  created_at: string;
};

export default function ActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getActivities();
      setActivities(data);
    }

    load();
  }, []);

  return (
    <section>
      <h3 className="text-lg font-semibold text-[#E6C850] mb-4">
        Histórico de Atividades
      </h3>

      <div className="space-y-4">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="flex items-start gap-4 bg-[#1F1F1F] border border-[#333] p-4 rounded-xl"
          >
            <div className="text-[#C0A040] mt-1">✔</div>

            <div>
              <p className="text-[#E0E0E0] font-medium">
                {activity.description}
              </p>
              <p className="text-xs text-[#888]">
                {new Date(activity.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-[#888]">
            Nenhuma atividade registrada.
          </p>
        )}
      </div>
    </section>
  );
}
