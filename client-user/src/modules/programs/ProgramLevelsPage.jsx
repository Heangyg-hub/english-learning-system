import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { programService } from '../../services/programService';

export default function ProgramLevelsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgramAndLevels = async () => {
      setLoading(true);
      try {
        const [progRes, levelsRes] = await Promise.all([
          programService.getById(id),
          programService.getLevels(id),
        ]);
        setProgram(progRes.data);
        setLevels(levelsRes.data || []);
      } catch (err) {
        setError('Failed to load program curriculum.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramAndLevels();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Icon icon="lucide:loader-2" width={40} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="browse-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#ef4444', marginBottom: 16 }}>{error || 'Program not found'}</p>
        <Link to="/programs" className="browse-back" style={{ color: '#2563eb' }}>
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="browse-page" style={{ maxWidth: '820px' }}>
      {/* ── Top Hero Banner (Image 4) ─────────────────────────────────── */}
      <div className="browse-hero browse-hero-compact">
        <Link to="/programs" className="browse-back">
          <Icon icon="lucide:arrow-left" width={16} style={{ marginRight: 4 }} />
          <span>Programs</span>
        </Link>
        <h1 className="browse-hero-title">{program.name}</h1>
        <p className="browse-hero-sub">
          Drag handle to reorder cards, or click to view subjects and vocabulary units
        </p>
      </div>

      {/* ── Level Cards List (Image 4) ────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        {levels.map((level, idx) => (
          <div
            key={level._id}
            onClick={() => navigate(`/programs/${id}/levels/${level._id}`)}
            className="level-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '18px 24px 18px 20px',
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
            {/* Left blue accent line (Image 4) */}
            <div className="level-card-accent" style={{ background: '#2563eb' }} />

            {/* Drag Handle dots (::) */}
            <div
              style={{
                color: '#94a3b8',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'grab',
              }}
            >
              <Icon icon="lucide:grip-vertical" width={18} />
            </div>

            {/* Level Card Body */}
            <div className="level-card-body" style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
                {level.name}
              </div>

              {/* Yellow / Gold Term Badge (Image 4) */}
              <div
                className="level-term-badge"
                style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: '999px',
                }}
              >
                Code: {level.code} (Level {idx + 1})
              </div>

              {/* Course Row */}
              <div className="level-course-row" style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                <span className="level-course-label" style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>
                  COURSE
                </span>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  {program.name} · {level.description || 'Target vocabulary and communicative competencies'}
                </span>
              </div>
            </div>

            {/* Chevron Right (Image 4) */}
            <div style={{ color: '#94a3b8', marginLeft: '12px' }}>
              <Icon icon="lucide:chevron-right" width={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
