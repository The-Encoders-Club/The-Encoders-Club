'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { t, getLocale, Locale } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  t: (key: Parameters<typeof t>[0]) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'es',
  t: (key) => key,
  toggleLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const detected = getLocale();
    setLocale(detected);
    document.documentElement.lang = detected;
  }, []);

  const translate = (key: Parameters<typeof t>[0]) => t(key, locale);

  const toggleLocale = () => {
    setLocale(prev => {
      const next = prev === 'es' ? 'en' : 'es';
      document.documentElement.lang = next;
      return next;
    });
  };

  return (
    <I18nContext.Provider value={{ locale, t: translate, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
