import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { dictionaryService } from '../../services/dictionaryService';
import AudioPlayer from '../../components/AudioPlayer';

export default function WordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Carousel states for each meaning's example
  const [exampleIndexes, setExampleIndexes] = useState({});
  const [speechRate, setSpeechRate] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      setLoading(true);
      try {
        const res = await dictionaryService.getWordById(id);
        setWord(res.data);
      } catch (err) {
        setError('Word entry not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchWord();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Icon icon="lucide:loader-2" width={40} color="#059669" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="dict-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#ef4444', marginBottom: 16 }}>{error || 'Word not found'}</p>
        <Link to="/dictionary" className="dict-chip dict-chip-active">
          Back to Dictionary
        </Link>
      </div>
    );
  }

  const handleCopyWord = () => {
    navigator.clipboard?.writeText(word.word);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeechRate = () => {
    setSpeechRate((prev) => (prev === 1 ? 0.75 : 1));
  };

  const handlePrevExample = (meaningIdx, total) => {
    setExampleIndexes((prev) => {
      const current = prev[meaningIdx] || 0;
      return { ...prev, [meaningIdx]: current === 0 ? total - 1 : current - 1 };
    });
  };

  const handleNextExample = (meaningIdx, total) => {
    setExampleIndexes((prev) => {
      const current = prev[meaningIdx] || 0;
      return { ...prev, [meaningIdx]: (current + 1) % total };
    });
  };

  return (
    <div className="dict-page vocab-detail-page" style={{ maxWidth: '820px' }}>
      {/* ── Top Bar with Back & Dictionary (Image 2) ─────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Icon icon="lucide:arrow-left" width={16} />
          <span>Back</span>
        </button>

        <Link
          to="/dictionary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Dictionary
        </Link>
      </div>

      {/* ── Giant Word Card (Image 2) ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
          padding: '48px 24px 36px',
          textAlign: 'center',
          marginBottom: '28px',
        }}
      >
        {/* Giant Green Word */}
        <h1
          style={{
            fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            fontWeight: 800,
            color: '#059669',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}
        >
          {word.word}
        </h1>

        {/* Phonetic pronunciation */}
        {word.pronunciation && (
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#10b981',
              fontFamily: 'monospace',
              marginBottom: '28px',
            }}
          >
            {word.pronunciation}
          </div>
        )}

        {/* Row of circular action buttons (Image 2) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* 1. Audio button */}
          <AudioPlayer text={word.word} audioUrl={word.audioUrl} size="md" />

          {/* 2. Speed button */}
          <button
            type="button"
            onClick={toggleSpeechRate}
            title="Speech rate"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #a7f3d0',
              backgroundColor: speechRate === 0.75 ? '#059669' : '#ecfdf5',
              color: speechRate === 0.75 ? '#ffffff' : '#059669',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {speechRate}x
          </button>

          {/* 3. Image button (if image available) */}
          <button
            type="button"
            title="Illustration image"
            onClick={() => word.imageUrl && window.open(word.imageUrl, '_blank')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #a7f3d0',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon="lucide:image" width={18} />
          </button>

          {/* 4. Copy word button */}
          <button
            type="button"
            onClick={handleCopyWord}
            title={copied ? 'Copied!' : 'Copy word'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #a7f3d0',
              backgroundColor: copied ? '#059669' : '#ecfdf5',
              color: copied ? '#ffffff' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} width={18} />
          </button>

          {/* 5. Link button */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            title="Share word link"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #a7f3d0',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon="lucide:link-2" width={18} />
          </button>

          {/* 6. Edit/Note icon */}
          <button
            type="button"
            title="Study note"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #a7f3d0',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon="lucide:pencil" width={18} />
          </button>
        </div>
      </div>

      {/* ── Section Pill: MEANINGS (Image 2) ─────────────────────────── */}
      <div style={{ textAlign: 'center', margin: '32px 0 16px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: '999px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          MEANINGS
        </span>
      </div>

      {/* ── Meaning Cards with Carousel (Image 2) ────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {word.meanings?.map((meaning, mIdx) => {
          const examples = meaning.examples || [];
          const activeExIdx = exampleIndexes[mIdx] || 0;
          const currentEx = examples[activeExIdx];

          return (
            <div
              key={mIdx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                padding: '24px',
              }}
            >
              {/* Header: POS info badge & Tip */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon icon="lucide:info" width={16} color="#059669" />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#059669',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {meaning.partOfSpeech?.toUpperCase()}.
                  </span>
                </div>

                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={meaning.usageKhmer || 'Usage hint'}
                >
                  <Icon icon="lucide:lightbulb" width={16} />
                </div>
              </div>

              {/* Definition row with audio */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.4,
                  }}
                  className="font-khmer"
                >
                  {meaning.khmerMeaning}
                </span>
              </div>

              {/* ── Examples Carousel (Image 2) ─────────────────────────── */}
              {examples.length > 0 && currentEx && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    marginTop: '16px',
                  }}
                >
                  {/* Examples Header with Counter and Arrows */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', color: '#64748b' }}>
                      EXAMPLES{' '}
                      <span style={{ color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                        {activeExIdx + 1}/{examples.length}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handlePrevExample(mIdx, examples.length)}
                        disabled={examples.length <= 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                        }}
                      >
                        <Icon icon="lucide:chevron-left" width={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextExample(mIdx, examples.length)}
                        disabled={examples.length <= 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                        }}
                      >
                        <Icon icon="lucide:chevron-right" width={16} />
                      </button>
                    </div>
                  </div>

                  {/* Sentence presentation */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.4,
                          marginBottom: '8px',
                        }}
                      >
                        {activeExIdx + 1}. {currentEx.english}
                      </div>

                      {currentEx.khmer && (
                        <div
                          className="font-khmer"
                          style={{
                            fontSize: '15px',
                            color: '#475569',
                            lineHeight: 1.5,
                          }}
                        >
                          {currentEx.khmer}
                        </div>
                      )}
                    </div>

                    {/* Example actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                      <AudioPlayer text={currentEx.english} size="sm" />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(currentEx.english);
                          alert('Example copied!');
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon icon="lucide:link-2" width={14} />
                      </button>
                    </div>
                  </div>

                  {/* Carousel pagination dots */}
                  {examples.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                      {examples.map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          onClick={() => setExampleIndexes((prev) => ({ ...prev, [mIdx]: dotIdx }))}
                          style={{
                            width: dotIdx === activeExIdx ? '16px' : '6px',
                            height: '6px',
                            borderRadius: '999px',
                            backgroundColor: dotIdx === activeExIdx ? '#059669' : '#cbd5e1',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section Pill: COMMON PATTERNS / COLLOCATIONS (Image 2) ─── */}
      <div style={{ textAlign: 'center', margin: '36px 0 16px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: '999px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          COMMON PATTERNS & COLLOCATIONS
        </span>
      </div>

      {/* Table of Collocations & Phrasal Verbs */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          marginBottom: '40px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>PATTERN</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>MEANING (KHMER)</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>EXAMPLE</th>
            </tr>
          </thead>
          <tbody>
            {/* Combine collocations, phrasal verbs, idioms into patterns table */}
            {word.meanings?.flatMap((m) => m.collocations || []).map((col, cIdx) => (
              <tr key={`col-${cIdx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>{col.phrase}</td>
                <td className="font-khmer" style={{ padding: '14px 20px', color: '#1e293b' }}>{col.khmerMeaning}</td>
                <td style={{ padding: '14px 20px', color: '#64748b', fontStyle: 'italic' }}>{col.example || '—'}</td>
              </tr>
            ))}

            {word.phrasalVerbs?.map((pv, pvIdx) => (
              <tr key={`pv-${pvIdx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563eb' }}>{pv.phrase} (phrasal)</td>
                <td className="font-khmer" style={{ padding: '14px 20px', color: '#1e293b' }}>{pv.khmerMeaning}</td>
                <td style={{ padding: '14px 20px', color: '#64748b', fontStyle: 'italic' }}>{pv.example || '—'}</td>
              </tr>
            ))}

            {word.idioms?.map((idm, idmIdx) => (
              <tr key={`idm-${idmIdx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#7c3aed' }}>{idm.phrase} (idiom)</td>
                <td className="font-khmer" style={{ padding: '14px 20px', color: '#1e293b' }}>{idm.khmerMeaning}</td>
                <td style={{ padding: '14px 20px', color: '#64748b', fontStyle: 'italic' }}>{idm.example || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
