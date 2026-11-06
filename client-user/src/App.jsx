import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import UserLayout from './layouts/UserLayout';
import HomePage from './modules/home/HomePage';
import ProgramsPage from './modules/programs/ProgramsPage';
import ProgramLevelsPage from './modules/programs/ProgramLevelsPage';
import SubjectSessionsPage from './modules/programs/SubjectSessionsPage';
import DictionaryPage from './modules/dictionary/DictionaryPage';
import WordDetailPage from './modules/dictionary/WordDetailPage';
import ProfilePage from './modules/profile/ProfilePage';
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Authentication Screen (Image 3) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Portal Layout Routes (Image 1 & 2) */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<HomePage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/:id" element={<ProgramLevelsPage />} />
              <Route path="programs/:id/levels/:levelId" element={<SubjectSessionsPage />} />
              <Route path="dictionary" element={<DictionaryPage />} />
              <Route path="dictionary/:id" element={<WordDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
