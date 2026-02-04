"use client";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
