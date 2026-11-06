import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Modal,
  Drawer,
  Form,
  Input,
  InputNumber,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Tooltip,
} from 'antd';
import { Icon } from '@iconify/react';
import { programService } from '../services/programService';

const { Title, Text } = Typography;

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Level Management Drawer
  const [levelsDrawerOpen, setLevelsDrawerOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [levelForm] = Form.useForm();
  const [submittingLevel, setSubmittingLevel] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await programService.getAll();
      setPrograms(res.data || []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openProgramModal = (program = null) => {
    setEditingProgram(program);
    if (program) {
      form.setFieldsValue({
        name: program.name,
        slug: program.slug,
        description: program.description,
        icon: program.icon,
        order: program.order,
        isActive: program.isActive,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ order: programs.length + 1, isActive: true });
    }
    setModalOpen(true);
  };

  const closeProgramModal = () => {
    setModalOpen(false);
    setEditingProgram(null);
    form.resetFields();
  };

  const handleProgramSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingProgram) {
        await programService.update(editingProgram._id, values);
        message.success('Program updated successfully');
      } else {
        await programService.create(values);
        message.success('Program created successfully');
      }
      closeProgramModal();
      fetchPrograms();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save program');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgramDelete = async (id) => {
    try {
      await programService.delete(id);
      message.success('Program deleted successfully');
      fetchPrograms();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete program');
    }
  };

  // ─── Level Handlers ──────────────────────────────────────────────────────────
  const openLevelsDrawer = async (program) => {
    setSelectedProgram(program);
    setLevelsDrawerOpen(true);
    fetchLevels(program._id);
  };

  const fetchLevels = async (programId) => {
    setLoadingLevels(true);
    try {
      const res = await programService.getLevels(programId);
      setLevels(res.data || []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load levels');
    } finally {
      setLoadingLevels(false);
    }
  };

  const openLevelModal = (level = null) => {
    setEditingLevel(level);
    if (level) {
      levelForm.setFieldsValue({
        name: level.name,
        code: level.code,
        description: level.description,
        order: level.order,
        isActive: level.isActive,
      });
    } else {
      levelForm.resetFields();
      levelForm.setFieldsValue({ order: levels.length + 1, isActive: true });
    }
    setLevelModalOpen(true);
  };

  const handleLevelSubmit = async (values) => {
    if (!selectedProgram) return;
    setSubmittingLevel(true);
    try {
      if (editingLevel) {
        await programService.updateLevel(selectedProgram._id, editingLevel._id, values);
        message.success('Level updated');
      } else {
        await programService.createLevel(selectedProgram._id, values);
        message.success('Level added');
      }
      setLevelModalOpen(false);
      setEditingLevel(null);
      fetchLevels(selectedProgram._id);
      fetchPrograms();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save level');
    } finally {
      setSubmittingLevel(false);
    }
  };

  const handleLevelDelete = async (levelId) => {
    if (!selectedProgram) return;
    try {
      await programService.deleteLevel(selectedProgram._id, levelId);
      message.success('Level removed');
      fetchLevels(selectedProgram._id);
      fetchPrograms();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete level');
    }
  };

  const programColumns = [
    {
      title: 'Order',
      dataIndex: 'order',
      width: 80,
      align: 'center',
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 70,
      align: 'center',
      render: (icon) => (
        <div style={{ display: 'inline-flex', padding: 6, borderRadius: 8, background: '#eff6ff', color: '#2563eb' }}>
          <Icon icon={icon || 'lucide:book-open'} width={20} />
        </div>
      ),
    },
    {
      title: 'Program Name',
      dataIndex: 'name',
      render: (text, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{r.description || 'No description provided'}</div>
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      render: (slug) => <code style={{ color: '#2563eb' }}>{slug}</code>,
    },
    {
      title: 'Levels',
      dataIndex: 'levelCount',
      width: 110,
      render: (count, r) => (
        <Button
          size="small"
          type="dashed"
          onClick={() => openLevelsDrawer(r)}
          icon={<Icon icon="lucide:layers" />}
        >
          {count || 0} Levels
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      width: 100,
      render: (active) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      width: 140,
      render: (_, r) => (
        <Space size={8}>
          <Tooltip title="Edit program">
            <Button
              type="text"
              size="small"
              icon={<Icon icon="lucide:pencil" color="#2563eb" width={16} />}
              onClick={() => openProgramModal(r)}
            />
          </Tooltip>
          <Tooltip title="Manage Curriculum Levels">
            <Button
              type="text"
              size="small"
              icon={<Icon icon="lucide:list-tree" color="#059669" width={16} />}
              onClick={() => openLevelsDrawer(r)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Program"
            description="Are you sure you want to delete this program and all its levels?"
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleProgramDelete(r._id)}
          >
            <Tooltip title="Delete program">
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

  const levelColumns = [
    {
      title: 'Order',
      dataIndex: 'order',
      width: 70,
      render: (o) => <Tag>{o}</Tag>,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 90,
      render: (c) => <Tag color="purple" style={{ fontWeight: 700 }}>{c}</Tag>,
    },
    {
      title: 'Level Name',
      dataIndex: 'name',
      render: (text, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{r.description}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      width: 90,
      render: (act) => <Tag color={act ? 'success' : 'default'}>{act ? 'Active' : 'Draft'}</Tag>,
    },
    {
      title: 'Actions',
      width: 100,
      render: (_, r) => (
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={<Icon icon="lucide:pencil" width={14} />}
            onClick={() => openLevelModal(r)}
          />
          <Popconfirm
            title="Delete Level"
            description="Are you sure you want to delete this level?"
            onConfirm={() => handleLevelDelete(r._id)}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<Icon icon="lucide:trash-2" width={14} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>Programs & Curriculum</Title>
              <Text type="secondary">Manage top-level English study tracks and their curriculum levels</Text>
            </div>
            <Button
              type="primary"
              icon={<Icon icon="lucide:plus" />}
              onClick={() => openProgramModal()}
              style={{ background: '#2563eb' }}
            >
              Add Program
            </Button>
          </div>
        }
        style={{ borderRadius: 14 }}
      >
        <Table
          dataSource={programs}
          columns={programColumns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Program Create/Edit Modal */}
      <Modal
        title={editingProgram ? 'Edit Program' : 'Create Learning Program'}
        open={modalOpen}
        onCancel={closeProgramModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProgramSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Program Name"
            rules={[{ required: true, message: 'Please input the program name!' }]}
          >
            <Input placeholder="e.g. General English (CEFR)" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL Slug"
            rules={[
              { required: true, message: 'Please input the slug!' },
              { pattern: /^[a-z0-9-]+$/, message: 'Slug must contain only lowercase letters, numbers, and hyphens' },
            ]}
          >
            <Input placeholder="e.g. general-english" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Comprehensive description of this learning pathway..." />
          </Form.Item>

          <Form.Item name="icon" label="Icon Identifier (Iconify name)">
            <Input placeholder="e.g. lucide:book-open, lucide:award, lucide:briefcase" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="order" label="Sort Order" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="isActive" label="Status" valuePropName="checked" style={{ flex: 1 }}>
              <Switch checkedChildren="Active" unCheckedChildren="Draft" />
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Space>
              <Button onClick={closeProgramModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting} style={{ background: '#2563eb' }}>
                Save Program
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Levels Management Drawer */}
      <Drawer
        title={
          selectedProgram && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon icon="lucide:layers" color="#2563eb" width={22} />
              <span>Curriculum Levels: {selectedProgram.name}</span>
            </div>
          )
        }
        width={680}
        open={levelsDrawerOpen}
        onClose={() => setLevelsDrawerOpen(false)}
        extra={
          <Button
            type="primary"
            size="small"
            icon={<Icon icon="lucide:plus" />}
            onClick={() => openLevelModal()}
            style={{ background: '#2563eb' }}
          >
            Add Level
          </Button>
        }
      >
        <Table
          dataSource={levels}
          columns={levelColumns}
          rowKey="_id"
          loading={loadingLevels}
          pagination={false}
          size="middle"
        />
      </Drawer>

      {/* Level Create/Edit Modal */}
      <Modal
        title={editingLevel ? 'Edit Level' : `Add Level to ${selectedProgram?.name}`}
        open={levelModalOpen}
        onCancel={() => setLevelModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={levelForm}
          layout="vertical"
          onFinish={handleLevelSubmit}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="code"
              label="Level Code"
              rules={[{ required: true, message: 'Code required!' }]}
              style={{ width: 140 }}
            >
              <Input placeholder="e.g. A1, B2" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Level Name"
              rules={[{ required: true, message: 'Name required!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="e.g. Pre-Intermediate" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Focus of this level..." />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="order" label="Sort Order" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="isActive" label="Status" valuePropName="checked" style={{ flex: 1 }}>
              <Switch checkedChildren="Active" unCheckedChildren="Draft" />
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setLevelModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submittingLevel} style={{ background: '#2563eb' }}>
                Save Level
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

