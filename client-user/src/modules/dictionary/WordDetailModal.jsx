import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { dictionaryService } from '../../services/dictionaryService';
import AudioPlayer from '../../components/AudioPlayer';

export default function WordDetailModal({ wordId, onClose }) {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meanings');

  useEffect(() => {
    const fetchWordDetail = async () => {
      setLoading(true);
      try {
        const res = await dictionaryService.getWordById(wordId);
        setWord(res.data);
      } catch (err) {
        console.error('Failed to load word details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (wordId) {
      fetchWordDetail();
    }
  }, [wordId]);

  if (!wordId) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          {loading ? (
            <div style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
              <Icon icon="lucide:loader-2" width={24} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {word?.word}
                </h2>
                {word?.isVerified && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    <Icon icon="lucide:badge-check" width={14} />
                    Verified
                  </span>
                )}
                {word?.difficulty && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {word.difficulty}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                {word?.pronunciation && (
                  <span style={{ fontSize: '15px', color: '#64748b', fontFamily: 'monospace' }}>
                    {word.pronunciation}
                  </span>
                )}
                <AudioPlayer text={word?.word} audioUrl={word?.audioUrl} size="sm" />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: '#f1f5f9',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <Icon icon="lucide:x" width={20} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        {!loading && word && (
          <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
            {/* Khmer Overview Note if present */}
            {word.noteKhmer && (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #2563eb',
                  padding: '14px 18px',
                  borderRadius: '0 12px 12px 0',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
                  សេចក្ដីពន្យល់សង្ខេប (Overview Note)
                </div>
                <div className="font-khmer" style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
                  {word.noteKhmer}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '20px', marginBottom: '24px' }}>
              {[
                { key: 'meanings', label: `Definitions & Examples (${word.meanings?.length || 0})` },
                { key: 'relations', label: 'Synonyms & Relations' },
                { key: 'phrases', label: `Phrasal Verbs & Idioms (${(word.phrasalVerbs?.length || 0) + (word.idioms?.length || 0)})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0 12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: activeTab === tab.key ? '#2563eb' : '#64748b',
                    borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Meanings & Examples */}
            {activeTab === 'meanings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {word.meanings?.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          textTransform: 'uppercase',
                        }}
                      >
                        {m.partOfSpeech}
                      </span>
                      <span className="font-khmer" style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                        {m.khmerMeaning}
                      </span>
                    </div>

                    {/* Structures */}
                    {m.structures?.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {m.structures.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Usage note */}
                    {m.usageKhmer && (
                      <div className="font-khmer" style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                        💡 {m.usageKhmer}
                      </div>
                    )}

                    {/* Examples */}
                    {m.examples?.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Example Sentences:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {m.examples.map((ex, exIdx) => (
                            <div key={exIdx} style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                                  {ex.english}
                                </span>
                                <AudioPlayer text={ex.english} size="sm" />
                              </div>
                              {ex.khmer && (
                                <div className="font-khmer" style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                  {ex.khmer}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collocations */}
                    {m.collocations?.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Collocations:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {m.collocations.map((c, cIdx) => (
                            <div key={cIdx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, color: '#2563eb' }}>• {c.phrase}</span>
                              <span className="font-khmer" style={{ color: '#64748b' }}>({c.khmerMeaning})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Synonyms & Relations */}
            {activeTab === 'relations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Synonyms */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Synonyms (ពាក្យមានន័យដូចគ្នា)
                  </h4>
                  {word.synonyms?.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                      {word.synonyms.map((s, idx) => (
                        <div key={idx} style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 700, color: '#2563eb' }}>{s.word}</div>
                          <div className="font-khmer" style={{ fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                            {s.khmerMeaning}
                          </div>
                          {s.differenceKhmer && (
                            <div className="font-khmer" style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              {s.differenceKhmer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>No synonyms recorded.</p>
                  )}
                </div>

                {/* Antonyms */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Antonyms (ពាក្យផ្ទុយ)
                  </h4>
                  {word.antonyms?.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {word.antonyms.map((a, idx) => (
                        <div key={idx} style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                          <span style={{ fontWeight: 700, color: '#dc2626' }}>{a.word}</span>
                          {a.khmerMeaning && (
                            <span className="font-khmer" style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                              ({a.khmerMeaning})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>No antonyms recorded.</p>
                  )}
                </div>

                {/* Word Family */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Related Forms / Word Family
                  </h4>
                  {word.relatedWords?.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {word.relatedWords.map((r, idx) => (
                        <div key={idx} style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{r.word}</span>
                          {r.relationship && (
                            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                              [{r.relationship}]
                            </span>
                          )}
                          {r.khmerMeaning && (
                            <span className="font-khmer" style={{ fontSize: '12px', color: '#475569', marginLeft: '6px' }}>
                              - {r.khmerMeaning}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>No related word forms recorded.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Phrasal Verbs & Idioms */}
            {activeTab === 'phrases' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Phrasal Verbs
                  </h4>
                  {word.phrasalVerbs?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {word.phrasalVerbs.map((pv, idx) => (
                        <div key={idx} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '15px' }}>{pv.phrase}</span>
                            <span className="font-khmer" style={{ fontWeight: 600, color: '#1e293b' }}>- {pv.khmerMeaning}</span>
                          </div>
                          {pv.example && (
                            <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', marginTop: '6px' }}>
                              "{pv.example}"
                            </div>
                          )}
                          {pv.exampleKhmer && (
                            <div className="font-khmer" style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {pv.exampleKhmer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>No phrasal verbs for this word.</p>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Idioms & Expressions
                  </h4>
                  {word.idioms?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {word.idioms.map((idm, idx) => (
                        <div key={idx} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, color: '#7c3aed', fontSize: '15px' }}>{idm.phrase}</span>
                            <span className="font-khmer" style={{ fontWeight: 600, color: '#1e293b' }}>- {idm.khmerMeaning}</span>
                          </div>
                          {idm.example && (
                            <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', marginTop: '6px' }}>
                              "{idm.example}"
                            </div>
                          )}
                          {idm.exampleKhmer && (
                            <div className="font-khmer" style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {idm.exampleKhmer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>No idioms recorded for this entry.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

