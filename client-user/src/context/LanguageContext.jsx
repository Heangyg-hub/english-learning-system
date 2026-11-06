import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('els_language') || 'km';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('els_language', lang);
    } catch (e) {
      // storage unavailable
    }
  };

  const isKhmer = language === 'km';
  const isEnglish = language === 'en';

  const t = (key, fallback) => {
    const translations = {
      'app.name': isKhmer ? 'ប្រព័ន្ធរៀនភាសាអង់គ្លេស' : 'English Learning System',
      'nav.programs': isKhmer ? 'កម្មវិធីសិក្សា' : 'Learning Programs',
      'nav.dictionary': isKhmer ? 'វចនានុក្រម' : 'Dictionary',
      'nav.profile': isKhmer ? 'គណនីសិស្ស' : 'Student Profile',
      'home.browsePrograms': isKhmer ? 'កម្មវិធីសិក្សា' : 'Browse Programs',
      'home.dictionary': isKhmer ? 'វចនានុក្រម' : 'Dictionary',
      'profile.settings': isKhmer ? 'ការកំណត់' : 'Settings',
      'profile.language': isKhmer ? 'ភាសា' : 'Language',
      'profile.feedback': isKhmer ? 'មតិកែលម្អ' : 'Feedback',
      'profile.scanQr': isKhmer ? 'ស្កេនកូដ QR' : 'Scan QR Code',
      'profile.theme': isKhmer ? 'រូបតំណាង' : 'Icon Theme',
      'profile.darkMode': isKhmer ? 'មុខងារងងឹត' : 'Dark Mode',
      'profile.privacy': isKhmer ? 'គោលការណ៍ភាពឯកជន' : 'Privacy Policy',
      'profile.logout': isKhmer ? 'ចាកចេញ' : 'Logout',
    };
    return translations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isKhmer,
        isEnglish,
        t,
        targetLanguage: 'english',
        nativeLanguage: isKhmer ? 'khmer' : 'english',
        setTargetLanguage: () => {},
        setNativeLanguage: () => {},
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
