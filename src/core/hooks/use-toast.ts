"use client";

import { toast as sonnerToast } from "sonner";

export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "info"
  | "warning";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const message = description ? `${title}\n${description}` : title;

    switch (variant) {
      case "success":
        return sonnerToast.success(title, {
          description,
        });
      case "destructive":
        return sonnerToast.error(title, {
          description,
        });
      case "warning":
        return sonnerToast.warning(title, {
          description,
        });
      case "info":
        return sonnerToast.info(title, {
          description,
        });
      default:
        return sonnerToast(title, {
          description,
        });
    }
  };

  return { toast };
}
