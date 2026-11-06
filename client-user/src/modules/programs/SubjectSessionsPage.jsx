import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useLanguage } from '../../context/LanguageContext';
import { programService } from '../../services/programService';
import { dictionaryService } from '../../services/dictionaryService';

export default function SubjectSessionsPage() {
  const { id, levelId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isKhmer = language === 'km';
  const [program, setProgram] = useState(null);
  const [level, setLevel] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const [progRes, levelsRes, vocabRes] = await Promise.all([
          programService.getById(id),
          programService.getLevels(id),
          dictionaryService.search({ limit: 1 }),
        ]);

        setProgram(progRes.data);
        const currentLevel = levelsRes.data?.find((l) => l._id === levelId) || levelsRes.data?.[0];
        setLevel(currentLevel);
        setWordCount(vocabRes.pagination?.total || 120);
      } catch (err) {
        console.error('Failed to load level sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [id, levelId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Icon icon="lucide:loader-2" width={40} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Sample units for this level
  const units = [
    {
      id: 'unit-1',
      dateLabel: 'Unit 1 · Daily Communication & Habits',
      wordsCount: 265,
      grammarCount: 12,
      teacher: 'SENGHEANG',
      timeSlot: 'Tue, Jul 28, 2026 · 7:00 PM – 8:30 PM',
    },
    {
      id: 'unit-2',
      dateLabel: 'Unit 2 · Workplace Essentials & Email Etiquette',
      wordsCount: 198,
      grammarCount: 8,
      teacher: 'SENGHEANG',
      timeSlot: 'Thu, Jul 30, 2026 · 7:00 PM – 8:30 PM',
    },
    {
      id: 'unit-3',
      dateLabel: 'Unit 3 · Critical Thinking & Academic Discussion',
      wordsCount: 142,
      grammarCount: 15,
      teacher: 'SENGHEANG',
      timeSlot: 'Sat, Aug 01, 2026 · 9:00 AM – 10:30 AM',
    },
  ];

  return (
    <div className="browse-page">
      {/* ── Top Hero Banner (Image 5) ─────────────────────────────────── */}
      <div className="browse-hero browse-hero-subjects">
        <Link to={`/programs/${id}`} className="browse-back">
          <Icon icon="lucide:arrow-left" width={16} />
          <span>Levels</span>
        </Link>

        {/* Circular Calendar Icon (Image 5) */}
        <div className="browse-hero-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.16)' }}>
          <Icon icon="lucide:calendar" width={26} />
        </div>

        <h1 className="browse-hero-title">Extra Vocabularies</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', opacity: 0.9, marginBottom: '6px' }}>
          <Icon icon="lucide:graduation-cap" width={16} />
          <span>Teacher: SENGHEANG</span>
        </div>

        <p className="browse-hero-sub">
          Choose a class date to open vocabulary, measure words & grammar
        </p>
      </div>

      {/* ── Section Title (Image 5) ──────────────────────────────────── */}
      <div style={{ marginTop: '28px', marginBottom: '14px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: '#64748b',
            textTransform: 'uppercase',
          }}
        >
          PAST CLASSES / CURRICULUM UNITS
        </span>
      </div>

      {/* ── Unit Cards with 2 Stats Columns (Image 5) ────────────────── */}
      {units.length === 0 ? (
        <div className="browse-empty-card">
          <div className="browse-empty-icon-wrap">
            <Icon icon="lucide:calendar-x" width={36} />
          </div>
          <div className="browse-empty-title">
            {isKhmer ? 'មិនទាន់មានមេរៀននៅឡើយទេ' : 'No Sessions Available Yet'}
          </div>
          <p className="browse-empty-desc">
            {isKhmer
              ? 'មេរៀន និងវាក្យសព្ទសម្រាប់ថ្នាក់នេះ នឹងត្រូវបានបញ្ចូលឆាប់ៗនេះ។'
              : 'Lessons and vocabulary units for this class will appear here soon.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {units.map((unit) => (
          <div
            key={unit.id}
            onClick={() => navigate('/dictionary')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Date Tag Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <Icon icon="lucide:calendar" width={14} />
                <span>{unit.timeSlot}</span>
              </div>
            </div>

            {/* Two Large Stats Boxes (Image 5) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {/* Box 1: Words (Green) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <Icon icon="lucide:languages" width={22} color="#059669" style={{ marginBottom: 4 }} />
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>
                  {unit.wordsCount}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', marginTop: 4 }}>
                  WORDS
                </div>
              </div>

              {/* Box 2: Grammar (Purple) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <Icon icon="lucide:pen-tool" width={22} color="#7c3aed" style={{ marginBottom: 4 }} />
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed', lineHeight: 1.1 }}>
                  {unit.grammarCount}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', marginTop: 4 }}>
                  GRAMMAR
                </div>
              </div>
            </div>

            {/* Bottom Bar: Teacher Avatar & Circular Arrow (Image 5) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unit.teacher.charAt(0)}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                  {unit.teacher}
                </span>
              </div>

              {/* Green circular arrow button (Image 5) */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="lucide:arrow-right" width={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

