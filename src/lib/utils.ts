import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return value.toLocaleString();
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `$${value.toLocaleString()}`;
}
