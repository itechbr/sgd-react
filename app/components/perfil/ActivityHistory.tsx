"use client";

type Activity = {
  icon: "clock" | "mail" | "check";
  text: string;
  date: string; // formato ISO: YYYY-MM-DD
};

const activities: Activity[] = [
  {
    icon: "clock",
    text: "Participou como avaliador na defesa de João Silva",
    date: "2025-10-15",
  },
  {
    icon: "mail",
    text: "Enviou solicitação de prorrogação de prazo",
    date: "2025-11-03",
  },
  {
    icon: "check",
    text: "Atualizou o perfil de usuário",
    date: "2025-11-09",
  },
  {
    icon: "clock",
    text: "Assistiu defesa de Maria Oliveira",
    date: "2025-11-10",
  },
  {
    icon: "mail",
    text: "Enviou documento complementar",
    date: "2025-11-11",
  },
];

const iconPaths = {
  clock:
    "M12 8v4l3 3m6 1.5A9.003 9.003 0 0012 3a9 9 0 00-9 9.5 8.998 8.998 0 006 8.485V21h6v-.015a8.998 8.998 0 006-8.485z",
  mail:
    "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6",
  check: "M5 13l4 4L19 7",
};

export default function ActivityHistory() {
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="space-y-4">
      <h3 className="text-[#E6C850] font-semibold text-lg">
        Histórico de Atividades
      </h3>

      {recentActivities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-[#181818] p-4 rounded-lg border border-[#333333]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-[#C0A040] mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d={iconPaths[activity.icon]}
            />
          </svg>

          <div>
            <p className="text-[#E0E0E0]">{activity.text}</p>
            <p className="text-xs text-[#888]">
              {new Date(activity.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
