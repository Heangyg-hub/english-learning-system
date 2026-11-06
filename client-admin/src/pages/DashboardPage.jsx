import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Spin, Typography } from 'antd';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../services/programService';
import { vocabularyService } from '../services/vocabularyService';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalLevels: 0,
    totalVocab: 0,
    verifiedVocab: 0,
  });
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [recentVocab, setRecentVocab] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [programsRes, vocabRes, vocabStatsRes] = await Promise.all([
          programService.getAll(),
          vocabularyService.getAll({ limit: 5 }),
          vocabularyService.getStats().catch(() => ({ data: {} })),
        ]);

        const programs = programsRes.data || [];
        const totalLevels = programs.reduce((acc, p) => acc + (p.levelCount || 0), 0);
        const vocabData = vocabRes.data || [];
        const vStats = vocabStatsRes.data || {};

        setRecentPrograms(programs.slice(0, 5));
        setRecentVocab(vocabData);
        setStats({
          totalPrograms: programs.length,
          totalLevels,
          totalVocab: vStats.total || vocabRes.pagination?.total || vocabData.length,
          verifiedVocab: vStats.verified || 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Learning Programs',
      value: stats.totalPrograms,
      icon: 'lucide:graduation-cap',
      color: '#2563eb',
      bg: '#eff6ff',
      link: '/programs',
    },
    {
      title: 'Curriculum Levels',
      value: stats.totalLevels,
      icon: 'lucide:layers',
      color: '#7c3aed',
      bg: '#f5f3ff',
      link: '/programs',
    },
    {
      title: 'Total Vocabulary',
      value: stats.totalVocab,
      icon: 'lucide:book-open',
      color: '#059669',
      bg: '#ecfdf5',
      link: '/dictionary',
    },
    {
      title: 'Verified Entries',
      value: stats.verifiedVocab,
      icon: 'lucide:check-circle-2',
      color: '#ea580c',
      bg: '#fff7ed',
      link: '/dictionary',
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Overview & Statistics</Title>
        <Text type="secondary">Welcome to the English Learning Management System</Text>
      </div>

      <Row gutter={[16, 16]}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card
              hoverable
              onClick={() => navigate(card.link)}
              style={{
                borderRadius: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                    {card.title}
                  </Text>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                    {card.value}
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  <Icon icon={card.icon} width={26} />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Active Programs</span>
                <Button type="link" onClick={() => navigate('/programs')}>View All</Button>
              </div>
            }
            style={{ borderRadius: 14 }}
          >
            <Table
              dataSource={recentPrograms}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  render: (text, r) => (
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{text}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>slug: {r.slug}</div>
                    </div>
                  ),
                },
                {
                  title: 'Levels',
                  dataIndex: 'levelCount',
                  render: (c) => <Tag color="blue">{c || 0} levels</Tag>,
                },
                {
                  title: 'Status',
                  dataIndex: 'isActive',
                  render: (active) => (
                    <Tag color={active ? 'success' : 'default'}>
                      {active ? 'Active' : 'Draft'}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Recent Vocabulary Entries</span>
                <Button type="link" onClick={() => navigate('/dictionary')}>Manage Dictionary</Button>
              </div>
            }
            style={{ borderRadius: 14 }}
          >
            <Table
              dataSource={recentVocab}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Word',
                  dataIndex: 'word',
                  render: (w, r) => (
                    <div>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{w}</span>
                      <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{r.pronunciation}</span>
                    </div>
                  ),
                },
                {
                  title: 'Primary Khmer',
                  render: (_, r) => r.meanings?.[0]?.khmerMeaning || '—',
                },
                {
                  title: 'Difficulty',
                  dataIndex: 'difficulty',
                  render: (d) => {
                    const colors = { easy: 'green', medium: 'orange', hard: 'red' };
                    return <Tag color={colors[d] || 'default'}>{d}</Tag>;
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

