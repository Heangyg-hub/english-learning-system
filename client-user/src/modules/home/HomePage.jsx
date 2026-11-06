import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function HomePage() {
  const modules = [
    {
      key: 'programs',
      title: 'Browse Programs',
      khmerTitle: 'កម្មវិធីសិក្សា',
      iconImg: '/theme-icons/default-icon/programs.png',
      fallbackIcon: 'lucide:graduation-cap',
      path: '/programs',
      description: 'Structured CEFR curriculum pathways, IELTS preparation, and business communication',
      active: true,
    },
    {
      key: 'dictionary',
      title: 'Dictionary',
      khmerTitle: 'វចនានុក្រម',
      iconImg: '/theme-icons/default-icon/dictionary.png',
      fallbackIcon: 'lucide:book-open',
      path: '/dictionary',
      description: 'Search bilingual English-Khmer words, phonetics, collocations, and idioms',
      active: true,
    },
    {
      key: 'daily-review',
      title: 'Daily Review',
      khmerTitle: 'ការរំលឹកប្រចាំថ្ងៃ',
      iconImg: '/theme-icons/default-icon/daily-review.png',
      fallbackIcon: 'lucide:calendar',
      path: '/dictionary',
      active: false,
    },
    {
      key: 'levels',
      title: 'CEFR Levels',
      khmerTitle: 'កម្រិតភាសា',
      iconImg: '/theme-icons/default-icon/exams.png',
      fallbackIcon: 'lucide:award',
      path: '/programs',
      active: false,
    },
    {
      key: 'arena',
      title: 'Vocab Arena',
      khmerTitle: 'ប្រកួតវាក្យសព្ទ',
      iconImg: '/theme-icons/default-icon/arena.png',
      fallbackIcon: 'lucide:gamepad-2',
      path: '/dictionary',
      active: false,
    },
    {
      key: 'board-draw',
      title: 'Board Draw',
      khmerTitle: 'គូរលើក្តារខៀន',
      iconImg: '/theme-icons/default-icon/board-draw.png',
      fallbackIcon: 'lucide:palette',
      path: '/dictionary',
      active: false,
    },
    {
      key: 'measure-words',
      title: 'Grammar Points',
      khmerTitle: 'វេយ្យាករណ៍',
      iconImg: '/theme-icons/default-icon/measure-words.png',
      fallbackIcon: 'lucide:scale',
      path: '/dictionary',
      active: false,
    },
    {
      key: 'daily-qa',
      title: 'Daily Q&A',
      khmerTitle: 'សំណួរ-ចម្លើយ',
      iconImg: '/theme-icons/default-icon/daily-qa.png',
      fallbackIcon: 'lucide:message-square',
      path: '/dictionary',
      active: false,
    },
  ];

  return (
    <div className="container" style={{ maxWidth: '580px', padding: '0.5rem 1rem 3rem' }}>
      {/* ── Outer Rounded Mobile Card Container (Matching Image 1) ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          padding: '1.25rem 1rem',
        }}
      >
        {/* Quick Actions Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            padding: '0 0.25rem',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              🌱 Farm
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                color: '#0891b2',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              📅 Schedule
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                color: '#e11d48',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              🎬 Feed
            </span>
          </div>
        </div>

        {/* 2-Column Grid of 3D Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {modules.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 0.75rem',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* 3D Icon */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <img
                  src={item.iconImg}
                  alt={item.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                <div style={{ display: 'none', color: '#10b981' }}>
                  <Icon icon={item.fallbackIcon} width={40} />
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
