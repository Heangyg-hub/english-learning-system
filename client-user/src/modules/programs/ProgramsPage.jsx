import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useLanguage } from '../../context/LanguageContext';
import { programService } from '../../services/programService';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isKhmer = language === 'km';

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await programService.getAll();
        setPrograms(res.data || []);
      } catch (err) {
        setError('Failed to load learning programs.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div className="browse-page">
      {/* ── Top Hero Banner (Matching Image 1, 3, 4, 5) ─────────────── */}
      <div className="browse-hero">
        <Link to="/" className="browse-back">
          <Icon icon="lucide:arrow-left" width={14} style={{ marginRight: 4 }} />
          <span>Home</span>
        </Link>

        <div className="browse-hero-icon">
          <Icon icon="lucide:graduation-cap" width={24} />
        </div>

        <h1 className="browse-hero-title">English Programs</h1>
        <p className="browse-hero-sub">
          Structured CEFR curriculum pathways, IELTS preparation, and professional business communication
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Icon icon="lucide:loader-2" width={36} color="#059669" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fef2f2', borderRadius: '12px', color: '#b91c1c' }}>
          {error}
        </div>
      ) : programs.length === 0 ? (
        <div className="browse-empty-card">
          <div className="browse-empty-icon-wrap">
            <Icon icon="lucide:book-open" width={36} />
          </div>
          <div className="browse-empty-title">
            {isKhmer ? 'មិនទាន់មានកម្មវិធីសិក្សានៅឡើយទេ' : 'No Programs Available Yet'}
          </div>
          <p className="browse-empty-desc">
            {isKhmer
              ? 'កម្មវិធីសិក្សាភាសាអង់គ្លេស និងកម្រិតសិក្សាថ្មីៗ នឹងត្រូវបានបន្ថែមឆាប់ៗនេះ។'
              : 'English learning curriculum pathways and levels will be added here soon.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
          {programs.map((program) => (
            <div
              key={program._id}
              onClick={() => navigate(`/programs/${program._id}`)}
              className="level-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px 24px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.18s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="level-card-accent" style={{ background: '#2563eb' }} />

              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0,
                }}
              >
                <Icon icon={program.icon || 'lucide:book-open'} width={22} />
              </div>

              <div className="level-card-body" style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '17px', color: '#0f172a' }}>
                  {program.name}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {program.description || 'Systematic language learning track'}
                </div>

                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {program.levelCount || 0} Curriculum Levels
                  </span>
                </div>
              </div>

              <div style={{ color: '#94a3b8', marginLeft: '12px' }}>
                <Icon icon="lucide:chevron-right" width={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
