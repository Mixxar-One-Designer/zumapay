'use client';

import { useSettings } from '@/app/SettingsProvider';
import { translations } from '@/translations';

export function useTranslation() {
  const { language } = useSettings();
  
  const t = (key: string): string => {
    // @ts-ignore - dynamic key access
    return translations[language]?.[key] || translations.English[key] || key;
  };
  
  return { t, language };
}