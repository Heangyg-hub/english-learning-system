import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', marginTop: 'auto', padding: '48px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Icon icon="lucide:languages" width={20} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>English Learning</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
              A modern English language learning platform built for Khmer speakers, featuring structured curriculum levels and rich bilingual vocabulary resources.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '16px' }}>Curriculum & Tracks</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#64748b' }}>
              <li><Link to="/programs" style={{ color: 'inherit' }}>General English (CEFR A1-C1)</Link></li>
              <li><Link to="/programs" style={{ color: 'inherit' }}>IELTS Academic Mastery</Link></li>
              <li><Link to="/programs" style={{ color: 'inherit' }}>Business English & Career</Link></li>
              <li><Link to="/dictionary" style={{ color: 'inherit' }}>Bilingual Dictionary</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '16px' }}>Study Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#64748b' }}>
              <li><span>Oxford 3000 & 5000 Words</span></li>
              <li><span>Academic Collocations</span></li>
              <li><span>Essential Phrasal Verbs</span></li>
              <li><span>Audio Pronunciation Player</span></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
          <div>© {new Date().getFullYear()} English Learning System. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Built with React 19 & Node.js</span>
            <a href="http://localhost:5174" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>
              Admin Panel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

