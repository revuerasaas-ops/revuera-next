"use client";

import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-stone-400" />
      </div>
      <h3 className="text-heading-sm text-stone-900 mb-2">{title}</h3>
      <p className="text-body-sm text-stone-500 text-center max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6 bg-brand-600 hover:bg-brand-700">
          {action.label}
        </Button>
      )}
    </div>
  );
}
