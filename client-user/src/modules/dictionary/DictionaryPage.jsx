import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { dictionaryService } from '../../services/dictionaryService';
import AudioPlayer from '../../components/AudioPlayer';

const POS_FILTER_OPTIONS = [
  { value: 'all', label: 'All', khmer: 'ទាំងអស់' },
  { value: 'noun', label: 'Nouns', khmer: 'នាម' },
  { value: 'verb', label: 'Verbs', khmer: 'កិរិយាស័ព្ទ' },
  { value: 'adjective', label: 'Adjectives', khmer: 'គុណនាម' },
  { value: 'adverb', label: 'Adverbs', khmer: 'គុណកិរិយា' },
  { value: 'preposition', label: 'Prepositions', khmer: 'ធ្នាក់' },
  { value: 'phrasal', label: 'Phrasal Verbs', khmer: 'កិរិយាស័ព្ទផ្សំ' },
  { value: 'idiom', label: 'Idioms', khmer: 'កន្សោមពាក្យ' },
];

export default function DictionaryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('words'); // 'words' | 'grammar'
  const [search, setSearch] = useState('');
  const [activePos, setActivePos] = useState('all');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDictionaryData = async () => {
    setLoading(true);
    try {
      const params = {
        limit: 100,
        ...(search ? { search } : {}),
        ...(activePos !== 'all' && activePos !== 'phrasal' && activePos !== 'idiom' ? { partOfSpeech: activePos } : {}),
      };

      const res = await dictionaryService.search(params);
      const items = res.data || [];
      setWords(items);
      setTotalCount(res.pagination?.total || items.length);
    } catch (err) {
      console.error('Failed to load dictionary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDictionaryData();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, activePos]);

  // Extract grammar patterns, phrasal verbs, and idioms for the Grammar tab
  const grammarItems = useMemo(() => {
    const list = [];
    words.forEach((w) => {
      // Structures in meanings
      w.meanings?.forEach((m) => {
        m.structures?.forEach((st) => {
          list.push({
            id: `${w._id}-st-${st}`,
            pattern: st,
            wordId: w._id,
            word: w.word,
            meaningKhmer: m.khmerMeaning,
            type: 'structure',
          });
        });
      });

      // Phrasal verbs
      w.phrasalVerbs?.forEach((pv, idx) => {
        list.push({
          id: `${w._id}-pv-${idx}`,
          pattern: pv.phrase,
          wordId: w._id,
          word: w.word,
          meaningKhmer: pv.khmerMeaning,
          example: pv.example,
          type: 'phrasal',
        });
      });

      // Idioms
      w.idioms?.forEach((idm, idx) => {
        list.push({
          id: `${w._id}-idm-${idx}`,
          pattern: idm.phrase,
          wordId: w._id,
          word: w.word,
          meaningKhmer: idm.khmerMeaning,
          example: idm.example,
          type: 'idiom',
        });
      });
    });

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return list.filter((item) =>
        item.pattern.toLowerCase().includes(q) || item.meaningKhmer?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [words, search]);

  const filteredWords = useMemo(() => {
    if (activePos === 'phrasal') {
      return words.filter((w) => w.phrasalVerbs?.length > 0);
    }
    if (activePos === 'idiom') {
      return words.filter((w) => w.idioms?.length > 0);
    }
    return words;
  }, [words, activePos]);

  return (
    <div className="dict-page">
      {/* ── Top Hero Banner (Image 1 & Image 3) ────────────────────────── */}
      <div className="browse-hero">
        <Link to="/" className="browse-back">
          <Icon icon="lucide:arrow-left" width={14} style={{ marginRight: 4 }} />
          <span>Home</span>
        </Link>

        <div className="browse-hero-icon">
          <Icon icon={activeTab === 'words' ? 'lucide:book-open' : 'lucide:sparkles'} width={24} />
        </div>

        <h1 className="browse-hero-title">Dictionary</h1>
        <p className="browse-hero-sub">
          {activeTab === 'words'
            ? 'Search every word, explore phonetics, collocations, and Khmer translations'
            : 'Search grammar points, structures, phrasal verbs, and sentence patterns'}
        </p>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            className="dict-book-btn"
            onClick={() => setActiveTab(activeTab === 'words' ? 'grammar' : 'words')}
          >
            <Icon icon="lucide:book-marked" width={14} />
            <span>{activeTab === 'words' ? 'Explore Grammar & Patterns' : 'Back to Vocabulary'}</span>
          </button>
        </div>
      </div>

      {/* ── Sticky Toolbar with Toggle & Search ──────────────────────── */}
      <div className="dict-toolbar">
        <div className="dict-toolbar-top-row">
          <div className="dict-toolbar-top-spacer" />

          {/* Toggle: Words vs Grammar */}
          <div className="dict-type-toggle-wrapper">
            <div className="dict-type-toggle">
              <button
                type="button"
                className={`dict-type-btn ${activeTab === 'words' ? 'dict-type-btn-active' : ''}`}
                onClick={() => setActiveTab('words')}
              >
                <Icon icon="lucide:languages" width={16} />
                <span>Words</span>
                <span className="dict-type-badge">{totalCount}</span>
              </button>

              <button
                type="button"
                className={`dict-type-btn ${activeTab === 'grammar' ? 'dict-type-btn-active' : ''}`}
                onClick={() => setActiveTab('grammar')}
              >
                <Icon icon="lucide:sparkles" width={16} />
                <span>Grammar & Idioms</span>
                <span className="dict-type-badge">{grammarItems.length}</span>
              </button>
            </div>
          </div>

          {/* Count on the right */}
          <div className="dict-toolbar-top-end">
            <span className="dict-count">
              {activeTab === 'words'
                ? `${filteredWords.length} shown of ${totalCount}`
                : `${grammarItems.length} patterns`}
            </span>
          </div>
        </div>

        {/* Search input */}
        <div className="dict-search">
          <Icon icon="lucide:search" width={18} className="dict-search-icon" />
          <input
            type="text"
            className="dict-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === 'words'
                ? 'Search English, phonetics, Khmer translation...'
                : 'Search grammar, structure, English, Khmer...'
            }
          />
          {search && (
            <button
              type="button"
              className="dict-search-clear"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <Icon icon="lucide:x" width={14} />
            </button>
          )}
        </div>

        {/* POS Filter Chips (Words tab only) */}
        {activeTab === 'words' && (
          <div className="dict-chips">
            {POS_FILTER_OPTIONS.map((pos) => (
              <button
                key={pos.value}
                type="button"
                className={`dict-chip ${activePos === pos.value ? 'dict-chip-active' : ''}`}
                onClick={() => setActivePos(pos.value)}
              >
                <span>{pos.label}</span>
                {pos.khmer && (
                  <span style={{ fontSize: '11px', opacity: 0.85, marginLeft: 4 }}>
                    ({pos.khmer})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content Grid (2 Columns) ─────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Icon icon="lucide:loader-2" width={36} color="#059669" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : activeTab === 'words' ? (
        <div className="dict-list">
          {filteredWords.length === 0 ? (
            <div className="empty-state">
              <Icon icon="lucide:search-x" width={40} color="#94a3b8" style={{ marginBottom: 8 }} />
              <p style={{ color: '#64748b', fontWeight: 600 }}>No vocabulary words match your search.</p>
            </div>
          ) : (
            filteredWords.map((item) => {
              const primaryMeaning = item.meanings?.[0];
              const definitionText = primaryMeaning?.khmerMeaning || '';
              const exampleText = primaryMeaning?.examples?.[0]?.english;

              return (
                <div
                  key={item._id}
                  className="dict-card dict-card-clickable"
                  onClick={() => navigate(`/dictionary/${item._id}`)}
                >
                  <div className="dict-card-main">
                    {/* Big green word */}
                    <div className="dict-card-char">
                      {item.word}
                    </div>

                    <div className="dict-card-body">
                      <div className="dict-sense">
                        {item.pronunciation && (
                          <span className="dict-pinyin">{item.pronunciation}</span>
                        )}
                        {primaryMeaning?.partOfSpeech && (
                          <span className="dict-pos">
                            {primaryMeaning.partOfSpeech.toUpperCase()}.
                          </span>
                        )}
                        <span className="dict-meaning font-khmer">
                          {definitionText}
                        </span>
                      </div>

                      {exampleText && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          "{exampleText}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions on the right */}
                  <div className="dict-card-actions" onClick={(e) => e.stopPropagation()}>
                    <AudioPlayer text={item.word} audioUrl={item.audioUrl} size="sm" />
                    <Link
                      to={`/dictionary/${item._id}`}
                      className="vocab-listen-btn"
                      title="Word details"
                    >
                      <Icon icon="lucide:link-2" width={16} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ── Grammar & Patterns List (Image 3) ───────────────────────── */
        <div className="dict-list">
          {grammarItems.length === 0 ? (
            <div className="empty-state">
              <Icon icon="lucide:sparkles" width={40} color="#94a3b8" style={{ marginBottom: 8 }} />
              <p style={{ color: '#64748b', fontWeight: 600 }}>No grammar patterns found.</p>
            </div>
          ) : (
            grammarItems.map((item) => (
              <div
                key={item.id}
                className="dict-card dict-card-clickable"
                onClick={() => navigate(`/dictionary/${item.wordId}`)}
              >
                <div className="dict-card-main" style={{ gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: item.type === 'idiom' ? '#f5f3ff' : '#ecfdf5',
                      color: item.type === 'idiom' ? '#7c3aed' : '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={item.type === 'idiom' ? 'lucide:quote' : 'lucide:pen-tool'} width={18} />
                  </div>

                  <div className="dict-card-body">
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                      {item.pattern}
                    </div>
                    <div className="font-khmer" style={{ fontSize: '13px', color: '#64748b' }}>
                      {item.meaningKhmer}
                    </div>
                  </div>
                </div>

                <div className="dict-card-actions" onClick={(e) => e.stopPropagation()}>
                  <AudioPlayer text={item.pattern} size="sm" />
                  <Link
                    to={`/dictionary/${item.wordId}`}
                    className="vocab-listen-btn"
                    title="View word"
                  >
                    <Icon icon="lucide:chevron-right" width={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
