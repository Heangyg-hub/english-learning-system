import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import BlueBookIcon from '../../components/icons/BlueBookIcon';
import LibraryIcon from '../../components/icons/LibraryIcon';
import './home-page.css';

export default function HomePage() {
  const { language } = useLanguage();

  const modules = [
    {
      key: 'programs',
      title: 'Browse Programs',
      khmerTitle: 'កម្មវិធីសិក្សា',
      icon: <BlueBookIcon size={54} />,
      path: '/programs',
      description: 'Structured CEFR curriculum pathways, IELTS preparation, and business communication',
      active: true,
    },
    {
      key: 'dictionary',
      title: 'Dictionary',
      khmerTitle: 'វចនានុក្រម',
      icon: <LibraryIcon size={54} />,
      path: '/dictionary',
      description: 'Search bilingual English-Khmer words, phonetics, collocations, and idioms',
      active: true,
    },
  ];

  return (
    <div className="home-page-container">
      {/* ── Outer Rounded Card Container (Responsive across Desktop, Tablet & Mobile) ── */}
      <div className="home-quick-actions-card">
        {/* Responsive Grid of Cards */}
        <div className="home-quick-actions-grid">
          {modules.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className="home-module-card"
            >
              {/* Icon */}
              <div className="home-module-icon-box">
                {item.icon}
              </div>

              {/* Title */}
              <div className="home-module-title">
                {language === 'km' ? item.khmerTitle : item.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', marginTop: '4px', fontWeight: 600 }}>
                {language === 'km' ? item.title : item.khmerTitle}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
