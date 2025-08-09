import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// i18n helper function
export function pickI18n<T extends Record<string, any>>(
  jsonb: T | null,
  locale: string,
  fallbackLocale: string = 'en'
): string {
  if (!jsonb) return '';
  
  // Try current locale first
  if (jsonb[locale]) return jsonb[locale];
  
  // Try fallback locale
  if (jsonb[fallbackLocale]) return jsonb[fallbackLocale];
  
  // Return first available value
  const firstValue = Object.values(jsonb)[0];
  return typeof firstValue === 'string' ? firstValue : '';
}

// Date formatting utilities
export function formatDate(date: string | Date, locale: string = 'en'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date, locale: string = 'en'): string {
  const d = new Date(date);
  return d.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Professor of the day calculation
export function getProfessorOfTheDayIndex(totalProfessors: number): number {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  if (totalProfessors === 0) return 0;
  return (year * 366 + dayOfYear) % totalProfessors;
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// File upload helpers
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
