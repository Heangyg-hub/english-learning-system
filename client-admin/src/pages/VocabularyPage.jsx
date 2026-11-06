import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tabs,
  Divider,
  Tooltip,
} from 'antd';
import { Icon } from '@iconify/react';
import { vocabularyService } from '../services/vocabularyService';

const { Title, Text } = Typography;
const { Option } = Select;

const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection',
  'phrase',
  'idiom',
];

const DIFFICULTIES = ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'];

export default function VocabularyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15, total: 0 });
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  // Drawer Form State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchVocabulary = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...(search ? { search } : {}),
        ...(difficultyFilter ? { difficulty: difficultyFilter } : {}),
        ...(verifiedFilter !== '' ? { isVerified: verifiedFilter } : {}),
      };

      const res = await vocabularyService.getAll(params);
      setData(res.data || []);
      if (res.pagination) {
        setPagination((prev) => ({
          ...prev,
          current: res.pagination.page,
          total: res.pagination.total,
        }));
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch vocabulary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary(1);
  }, [difficultyFilter, verifiedFilter]);

  const handleSearch = () => {
    fetchVocabulary(1);
  };

  const openDrawer = (record = null) => {
    form.resetFields();
    if (record) {
      setEditingId(record._id);
      form.setFieldsValue({
        word: record.word,
        pronunciation: record.pronunciation,
        difficulty: record.difficulty || 'easy',
        tags: record.tags || [],
        topics: record.topics || [],
        noteKhmer: record.noteKhmer,
        audioUrl: record.audioUrl,
        imageUrl: record.imageUrl,
        isVerified: record.isVerified,
        meanings: record.meanings?.length ? record.meanings : [
          {
            partOfSpeech: 'noun',
            khmerMeaning: '',
            structures: [],
            usageKhmer: '',
            examples: [],
            collocations: [],
          },
        ],
        synonyms: record.synonyms || [],
        antonyms: record.antonyms || [],
        relatedWords: record.relatedWords || [],
        phrasalVerbs: record.phrasalVerbs || [],
        idioms: record.idioms || [],
      });
    } else {
      setEditingId(null);
      form.setFieldsValue({
        difficulty: 'easy',
        isVerified: false,
        meanings: [
          {
            partOfSpeech: 'noun',
            khmerMeaning: '',
            structures: [],
            usageKhmer: '',
            examples: [{ english: '', khmer: '' }],
            collocations: [],
          },
        ],
      });
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingId) {
        await vocabularyService.update(editingId, values);
        message.success('Vocabulary word updated successfully');
      } else {
        await vocabularyService.create(values);
        message.success('New vocabulary word created successfully');
      }
      closeDrawer();
      fetchVocabulary(pagination.current);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save vocabulary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await vocabularyService.delete(id);
      message.success('Vocabulary word deleted');
      fetchVocabulary(pagination.current);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete vocabulary');
    }
  };

  const columns = [
    {
      title: 'Word',
      dataIndex: 'word',
      render: (w, r) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{w}</span>
            {r.isVerified && (
              <Tooltip title="Verified Entry">
                <Icon icon="lucide:badge-check" color="#2563eb" width={16} />
              </Tooltip>
            )}
          </div>
          {r.pronunciation && (
            <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
              {r.pronunciation}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Part of Speech',
      render: (_, r) => (
        <Space wrap orientation="horizontal" size={4}>
          {r.meanings?.map((m, i) => (
            <Tag key={i} color="blue" className="badge-pos">
              {m.partOfSpeech}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Primary Khmer Meaning',
      render: (_, r) => (
        <div style={{ fontFamily: "'Kantumruy Pro', sans-serif", color: '#1e293b' }}>
          {r.meanings?.[0]?.khmerMeaning || '—'}
        </div>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      width: 100,
      render: (d) => {
        const colors = {
          easy: 'success',
          beginner: 'success',
          medium: 'warning',
          intermediate: 'warning',
          hard: 'error',
          advanced: 'error',
        };
        return <Tag color={colors[d] || 'default'}>{d}</Tag>;
      },
    },
    {
      title: 'Tags / Topics',
      render: (_, r) => (
        <Space wrap size={4}>
          {r.topics?.map((t, i) => (
            <Tag key={`top-${i}`} color="purple">{t}</Tag>
          ))}
          {r.tags?.map((tag, i) => (
            <Tag key={`tag-${i}`}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      width: 90,
      render: (verified) => (
        <Tag color={verified ? 'success' : 'default'}>
          {verified ? 'Verified' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      width: 110,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Edit word">
            <Button
              type="text"
              size="small"
              icon={<Icon icon="lucide:pencil" color="#2563eb" width={16} />}
              onClick={() => openDrawer(r)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Word"
            description="Are you sure you want to delete this word?"
            onConfirm={() => handleDelete(r._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete word">
              <Button
                type="text"
                size="small"
                danger
                icon={<Icon icon="lucide:trash-2" width={16} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>English-Khmer Dictionary</Title>
              <Text type="secondary">Manage vocabulary entries, definitions, collocations, and idioms</Text>
            </div>
            <Button
              type="primary"
              icon={<Icon icon="lucide:plus" />}
              onClick={() => openDrawer()}
              style={{ background: '#2563eb' }}
            >
              Add New Word
            </Button>
          </div>
        }
        style={{ borderRadius: 14 }}
      >
        {/* Search & Filters */}
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={10} md={12}>
            <Input.Search
              placeholder="Search by English word, Khmer meaning, or example..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
              allowClear
              enterButton={<Button type="primary" style={{ background: '#2563eb' }}>Search</Button>}
            />
          </Col>
          <Col xs={12} sm={7} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Difficulty"
              allowClear
              value={difficultyFilter || undefined}
              onChange={(val) => setDifficultyFilter(val || '')}
            >
              <Option value="">All Difficulties</Option>
              {DIFFICULTIES.map((d) => (
                <Option key={d} value={d}>{d.toUpperCase()}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={7} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Verification"
              allowClear
              value={verifiedFilter}
              onChange={(val) => setVerifiedFilter(val)}
            >
              <Option value="">All Verification</Option>
              <Option value="true">Verified Only</Option>
              <Option value="false">Unverified</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (p) => fetchVocabulary(p),
            showTotal: (total) => `Total ${total} words`,
          }}
        />
      </Card>

      {/* Vocabulary Drawer */}
      <Drawer
        title={editingId ? 'Edit Vocabulary Entry' : 'Create New Vocabulary Word'}
        width={760}
        open={drawerOpen}
        onClose={closeDrawer}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={submitting}
              style={{ background: '#2563eb' }}
            >
              Save Word
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Tabs
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: '1. Basic & Classification',
                children: (
                  <div>
                    <Row gutter={16}>
                      <Col span={14}>
                        <Form.Item
                          name="word"
                          label="English Word"
                          rules={[{ required: true, message: 'English word is required' }]}
                        >
                          <Input size="large" placeholder="e.g. resilient" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item name="pronunciation" label="Phonetic IPA">
                          <Input size="large" placeholder="e.g. /rɪˈzɪliənt/" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="difficulty" label="Difficulty Level">
                          <Select placeholder="Select difficulty">
                            {DIFFICULTIES.map((d) => (
                              <Option key={d} value={d}>{d}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="isVerified" label="Verified Status" valuePropName="checked">
                          <Switch checkedChildren="Verified" unCheckedChildren="Draft" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="topics" label="Topics / Categories">
                          <Select mode="tags" placeholder="Press enter to add topics (e.g. Business, Science)" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="tags" label="Curriculum Tags">
                          <Select mode="tags" placeholder="Tags (e.g. ielts, oxford-3000, academic)" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="noteKhmer" label="Khmer Overview Note (ចំណាំបន្ថែមជាភាសាខ្មែរ)">
                      <Input.TextArea rows={3} placeholder="ពន្យល់សង្ខេបអំពីរបៀបប្រើប្រាស់ពាក្យនេះ..." />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="audioUrl" label="Custom Audio URL">
                          <Input placeholder="https://.../pronunciation.mp3" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="imageUrl" label="Illustration Image URL">
                          <Input placeholder="https://.../image.jpg" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: 'meanings',
                label: '2. Meanings & Examples',
                children: (
                  <div>
                    <Form.List name="meanings">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map(({ key, name, ...restField }, index) => (
                            <Card
                              key={key}
                              size="small"
                              title={`Meaning Definition #${index + 1}`}
                              extra={
                                fields.length > 1 && (
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<Icon icon="lucide:trash-2" />}
                                    onClick={() => remove(name)}
                                  >
                                    Remove
                                  </Button>
                                )
                              }
                              style={{ marginBottom: 16, background: '#f8fafc', borderColor: '#cbd5e1' }}
                            >
                              <Row gutter={12}>
                                <Col span={8}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'partOfSpeech']}
                                    label="Part of Speech"
                                    rules={[{ required: true, message: 'POS is required' }]}
                                  >
                                    <Select>
                                      {PARTS_OF_SPEECH.map((pos) => (
                                        <Option key={pos} value={pos}>{pos.toUpperCase()}</Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={16}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'khmerMeaning']}
                                    label="Khmer Definition (អត្ថន័យជាភាសាខ្មែរ)"
                                    rules={[{ required: true, message: 'Khmer meaning required' }]}
                                  >
                                    <Input placeholder="e.g. ភាពរឹងមាំ, ដែលធន់" />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item
                                {...restField}
                                name={[name, 'structures']}
                                label="Grammar Structures"
                              >
                                <Select mode="tags" placeholder="e.g. resilient to something, highly resilient" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'usageKhmer']}
                                label="Khmer Usage Note"
                              >
                                <Input placeholder="ពន្យល់អំពីកាលៈទេសៈប្រើប្រាស់..." />
                              </Form.Item>

                              {/* Examples List */}
                              <Divider style={{ margin: '12px 0' }}>Sentence Examples</Divider>
                              <Form.List name={[name, 'examples']}>
                                {(exFields, { add: addEx, remove: removeEx }) => (
                                  <div>
                                    {exFields.map((ex, exIdx) => (
                                      <div key={ex.key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                          <Form.Item
                                            {...ex}
                                            name={[ex.name, 'english']}
                                            rules={[{ required: true, message: 'English sentence required' }]}
                                            style={{ marginBottom: 6 }}
                                          >
                                            <Input placeholder={`English Example ${exIdx + 1}`} />
                                          </Form.Item>
                                          <Form.Item
                                            {...ex}
                                            name={[ex.name, 'khmer']}
                                            style={{ marginBottom: 0 }}
                                          >
                                            <Input placeholder="Khmer translation" />
                                          </Form.Item>
                                        </div>
                                        <Button
                                          type="text"
                                          danger
                                          icon={<Icon icon="lucide:x" />}
                                          onClick={() => removeEx(ex.name)}
                                        />
                                      </div>
                                    ))}
                                    <Button
                                      type="dashed"
                                      size="small"
                                      onClick={() => addEx({ english: '', khmer: '' })}
                                      icon={<Icon icon="lucide:plus" />}
                                      block
                                    >
                                      Add Example Sentence
                                    </Button>
                                  </div>
                                )}
                              </Form.List>

                              {/* Collocations */}
                              <Divider style={{ margin: '12px 0' }}>Collocations</Divider>
                              <Form.List name={[name, 'collocations']}>
                                {(colFields, { add: addCol, remove: removeCol }) => (
                                  <div>
                                    {colFields.map((col) => (
                                      <div key={col.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                        <Form.Item {...col} name={[col.name, 'phrase']} style={{ flex: 1, marginBottom: 0 }}>
                                          <Input placeholder="Phrase (e.g. highly resilient)" />
                                        </Form.Item>
                                        <Form.Item {...col} name={[col.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                          <Input placeholder="Khmer Meaning" />
                                        </Form.Item>
                                        <Button
                                          type="text"
                                          danger
                                          icon={<Icon icon="lucide:x" />}
                                          onClick={() => removeCol(col.name)}
                                        />
                                      </div>
                                    ))}
                                    <Button
                                      type="dashed"
                                      size="small"
                                      onClick={() => addCol({ phrase: '', khmerMeaning: '' })}
                                      icon={<Icon icon="lucide:plus" />}
                                      block
                                    >
                                      Add Collocation
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Card>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => add({ partOfSpeech: 'noun', khmerMeaning: '', examples: [] })}
                            icon={<Icon icon="lucide:plus" />}
                            block
                            style={{ height: 42 }}
                          >
                            Add Another Meaning
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ),
              },
              {
                key: 'relations',
                label: '3. Synonyms & Related Words',
                children: (
                  <div>
                    {/* Synonyms */}
                    <Title level={5}>Synonyms</Title>
                    <Form.List name="synonyms">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f) => (
                            <div key={f.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Form.Item {...f} name={[f.name, 'word']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Synonym word" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Khmer meaning" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'differenceKhmer']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Nuance / difference in Khmer" />
                              </Form.Item>
                              <Button type="text" danger icon={<Icon icon="lucide:x" />} onClick={() => remove(f.name)} />
                            </div>
                          ))}
                          <Button size="small" type="dashed" onClick={() => add()} icon={<Icon icon="lucide:plus" />} block>
                            Add Synonym
                          </Button>
                        </div>
                      )}
                    </Form.List>

                    {/* Antonyms */}
                    <Title level={5} style={{ marginTop: 20 }}>Antonyms</Title>
                    <Form.List name="antonyms">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f) => (
                            <div key={f.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Form.Item {...f} name={[f.name, 'word']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Antonym word" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Khmer meaning" />
                              </Form.Item>
                              <Button type="text" danger icon={<Icon icon="lucide:x" />} onClick={() => remove(f.name)} />
                            </div>
                          ))}
                          <Button size="small" type="dashed" onClick={() => add()} icon={<Icon icon="lucide:plus" />} block>
                            Add Antonym
                          </Button>
                        </div>
                      )}
                    </Form.List>

                    {/* Related Words */}
                    <Title level={5} style={{ marginTop: 20 }}>Word Family / Related Forms</Title>
                    <Form.List name="relatedWords">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f) => (
                            <div key={f.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Form.Item {...f} name={[f.name, 'word']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Word (e.g. resilience)" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'relationship']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Relationship (e.g. noun form)" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                <Input placeholder="Khmer meaning" />
                              </Form.Item>
                              <Button type="text" danger icon={<Icon icon="lucide:x" />} onClick={() => remove(f.name)} />
                            </div>
                          ))}
                          <Button size="small" type="dashed" onClick={() => add()} icon={<Icon icon="lucide:plus" />} block>
                            Add Related Word
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ),
              },
              {
                key: 'idioms',
                label: '4. Phrasal Verbs & Idioms',
                children: (
                  <div>
                    {/* Phrasal Verbs */}
                    <Title level={5}>Phrasal Verbs</Title>
                    <Form.List name="phrasalVerbs">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f) => (
                            <Card key={f.key} size="small" style={{ marginBottom: 10, background: '#f8fafc' }}>
                              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <Form.Item {...f} name={[f.name, 'phrase']} style={{ flex: 1, marginBottom: 0 }}>
                                  <Input placeholder="Phrasal Verb (e.g. bounce back)" />
                                </Form.Item>
                                <Form.Item {...f} name={[f.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                  <Input placeholder="Khmer Meaning" />
                                </Form.Item>
                                <Button type="text" danger icon={<Icon icon="lucide:trash-2" />} onClick={() => remove(f.name)} />
                              </div>
                              <Form.Item {...f} name={[f.name, 'example']} style={{ marginBottom: 4 }}>
                                <Input placeholder="Example sentence in English" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'exampleKhmer']} style={{ marginBottom: 0 }}>
                                <Input placeholder="Example sentence in Khmer" />
                              </Form.Item>
                            </Card>
                          ))}
                          <Button size="small" type="dashed" onClick={() => add()} icon={<Icon icon="lucide:plus" />} block>
                            Add Phrasal Verb
                          </Button>
                        </div>
                      )}
                    </Form.List>

                    {/* Idioms */}
                    <Title level={5} style={{ marginTop: 20 }}>Idioms & Expressions</Title>
                    <Form.List name="idioms">
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f) => (
                            <Card key={f.key} size="small" style={{ marginBottom: 10, background: '#f8fafc' }}>
                              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <Form.Item {...f} name={[f.name, 'phrase']} style={{ flex: 1, marginBottom: 0 }}>
                                  <Input placeholder="Idiom phrase (e.g. silver tongue)" />
                                </Form.Item>
                                <Form.Item {...f} name={[f.name, 'khmerMeaning']} style={{ flex: 1, marginBottom: 0 }}>
                                  <Input placeholder="Khmer Meaning" />
                                </Form.Item>
                                <Button type="text" danger icon={<Icon icon="lucide:trash-2" />} onClick={() => remove(f.name)} />
                              </div>
                              <Form.Item {...f} name={[f.name, 'example']} style={{ marginBottom: 4 }}>
                                <Input placeholder="Example sentence in English" />
                              </Form.Item>
                              <Form.Item {...f} name={[f.name, 'exampleKhmer']} style={{ marginBottom: 0 }}>
                                <Input placeholder="Example sentence in Khmer" />
                              </Form.Item>
                            </Card>
                          ))}
                          <Button size="small" type="dashed" onClick={() => add()} icon={<Icon icon="lucide:plus" />} block>
                            Add Idiom
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Drawer>
    </div>
  );
}

