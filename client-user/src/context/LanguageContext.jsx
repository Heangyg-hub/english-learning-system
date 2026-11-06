import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [targetLanguage, setTargetLanguage] = useState('english');
  const [nativeLanguage, setNativeLanguage] = useState('khmer');

  return (
    <LanguageContext.Provider value={{ targetLanguage, setTargetLanguage, nativeLanguage, setNativeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

