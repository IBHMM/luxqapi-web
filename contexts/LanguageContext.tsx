"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Language = "az" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  az: {
    home: "Ana səhifə",
    products: "Məhsullar",
    blogs: "Bloqlar",
    categories: "Kateqoriyalar",
    "view-all": "Hamısına bax",
    "read-more": "Daha çox oxu",
    "latest-blogs": "Son bloqlar",
    "our-products": "Məhsullarımız",
    "product-categories": "Məhsul kateqoriyaları",
    "filter-by-category": "Kateqoriyaya görə filtr",
    "filter-by-color": "Rəngə görə filtr",
    "all-categories": "Bütün kateqoriyalar",
    "all-colors": "Bütün rənglər",
    "related-products": "Əlaqəli məhsullar",
    "category-description": "Müxtəlif kateqoriyalarda premium qapılar",
    specifications: "Spesifikasiyalar",
    block_header: "Son xəbərlər və məqalələr",
    variants: "Variantlar",
    price: "Qiymət",
    "contact-us": "Bizimlə əlaqə",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    "follow-us": "Bizi izləyin",
    loading: "Yüklənir...",
    error: "Xəta baş verdi",
    "try-again": "Yenidən cəhd edin",
    "no-products": "Məhsul tapılmadı",
    "no-blogs": "Bloq tapılmadı",
    previous: "Əvvəlki",
    next: "Növbəti",
    page: "Səhifə",
    of: "dan",
    views: "baxış",
  },
  ru: {
    home: "Главная",
    products: "Продукты",
    blogs: "Блоги",
    categories: "Категории",
    "view-all": "Посмотреть все",
    "read-more": "Читать далее",
    "latest-blogs": "Последние блоги",
    "our-products": "Наши продукты",
    "product-categories": "Категории продуктов",
    "filter-by-category": "Фильтр по категории",
    "filter-by-color": "Фильтр по цвету",
    "all-categories": "Все категории",
    "all-colors": "Все цвета",
    "related-products": "Связанные продукты",
    "category-description": "Разнообразные категории премиум дверей",
    specifications: "Характеристики",
    block_header: "Последние новости и статьи",
    variants: "Варианты",
    price: "Цена",
    "contact-us": "Связаться с нами",
    phone: "Телефон",
    whatsapp: "WhatsApp",
    "follow-us": "Подписывайтесь",
    loading: "Загрузка...",
    error: "Произошла ошибка",
    "try-again": "Попробовать снова",
    "no-products": "Продукты не найдены",
    "no-blogs": "Блоги не найдены",
    previous: "Предыдущий",
    next: "Следующий",
    page: "Страница",
    of: "из",
    views: "просмотров",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("az");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as Language | null;
    if (storedLang === "az" || storedLang === "ru") {
      setLanguageState(storedLang);
    }
  }, []);

  // Save to localStorage on change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["az"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
