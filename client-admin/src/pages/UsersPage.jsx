import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Avatar,
  Badge,
} from 'antd';
import { Icon } from '@iconify/react';
import { userService } from '../services/userService';

const { Title, Text } = Typography;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({
        search: searchText || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
      setUsers(res.data || []);
    } catch (err) {
      message.error(err.response?.data?.message || err.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      role: 'user',
      isActive: true,
      password: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.resetFields();
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      role: record.role || 'user',
      isActive: record.isActive !== false,
      password: '', // Blank unless admin wants to reset it
    });
    setModalOpen(true);
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ password: pass });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingUser) {
        // Update user
        const updateData = {
          username: values.username,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
        };
        if (values.password && values.password.trim()) {
          updateData.password = values.password.trim();
        }

        await userService.update(editingUser._id, updateData);
        message.success(`Account for "${values.username}" updated successfully.`);
      } else {
        // Create user
        await userService.create(values);
        message.success(`Student account created for "${values.username}"!`);
      }

      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      if (err.errorFields) return; // Antd validation error
      message.error(err.response?.data?.message || err.message || 'Failed to save account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      message.success('Account deleted successfully.');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.message || err.message || 'Failed to delete account.');
    }
  };

  const columns = [
    {
      title: 'Student / User',
      dataIndex: 'username',
      key: 'username',
      render: (name, record) => (
        <Space size={12}>
          <Avatar
            style={{
              backgroundColor: record.role === 'admin' ? '#7c3aed' : '#2563eb',
              fontWeight: 700,
            }}
            src={record.avatar}
          >
            {name?.slice(0, 2)?.toUpperCase() || 'U'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      render: (role) => (
        <Tag
          color={role === 'admin' ? 'purple' : 'blue'}
          style={{ fontWeight: 600, padding: '2px 10px', borderRadius: 999 }}
        >
          {role === 'admin' ? 'Administrator' : 'Student (User)'}
        </Tag>
      ),
    },
    {
      title: 'Access Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive) => (
        <Badge
          status={isActive ? 'success' : 'error'}
          text={
            <span style={{ fontWeight: 500, color: isActive ? '#059669' : '#dc2626' }}>
              {isActive ? 'Active' : 'Deactivated'}
            </span>
          }
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {date ? new Date(date).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<Icon icon="lucide:edit-3" width={16} />}
            onClick={() => openEditModal(record)}
            title="Edit student account"
          />
          <Popconfirm
            title="Delete this user account?"
            description="The student will no longer be able to log in to the portal."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<Icon icon="lucide:trash-2" width={16} />}
              title="Delete account"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            Student & User Accounts
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Only administrators can provision and manage login credentials for students.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<Icon icon="lucide:user-plus" width={16} style={{ marginRight: 4 }} />}
          onClick={openCreateModal}
          size="middle"
          style={{ background: '#2563eb' }}
        >
          Add Student Account
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <form onSubmit={handleSearch}>
          <Space wrap size={16}>
            <Input
              placeholder="Search by student name or email…"
              prefix={<Icon icon="lucide:search" color="#94a3b8" width={16} style={{ marginRight: 4 }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              allowClear
            />

            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 170 }}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'user', label: 'Students (user)' },
                { value: 'admin', label: 'Administrators' },
              ]}
            />

            <Button type="default" htmlType="submit">
              Search
            </Button>

            <Button
              type="text"
              onClick={() => {
                setSearchText('');
                setRoleFilter('all');
                userService.getAll().then((res) => setUsers(res.data || []));
              }}
            >
              Reset
            </Button>
          </Space>
        </form>
      </Card>

      {/* Users Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} accounts` }}
        />
      </Card>

      {/* Create / Edit User Modal */}
      <Modal
        title={editingUser ? `Edit Account: ${editingUser.username}` : 'Create Student / User Account'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editingUser ? 'Save Changes' : 'Create Account'}
        destroyOnClose
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="username"
            label="Full Name / Student Name"
            rules={[
              { required: true, message: 'Please input full name or username.' },
              { min: 3, message: 'Username must be at least 3 characters.' },
            ]}
          >
            <Input
              prefix={<Icon icon="lucide:user" color="#94a3b8" width={16} style={{ marginRight: 6 }} />}
              placeholder="e.g. Sophea Learner"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address (Login Username)"
            rules={[
              { required: true, message: 'Please input an email address.' },
              { type: 'email', message: 'Please input a valid email address.' },
            ]}
          >
            <Input
              prefix={<Icon icon="lucide:mail" color="#94a3b8" width={16} style={{ marginRight: 6 }} />}
              placeholder="e.g. sophea@student.els.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={editingUser ? 'Reset Password (leave empty to keep current)' : 'Initial Password'}
            rules={
              !editingUser
                ? [
                    { required: true, message: 'Please input an initial password.' },
                    { min: 6, message: 'Password must be at least 6 characters.' },
                  ]
                : [{ min: 6, message: 'Password must be at least 6 characters.' }]
            }
          >
            <Input.Password
              prefix={<Icon icon="lucide:lock" color="#94a3b8" width={16} style={{ marginRight: 6 }} />}
              placeholder={editingUser ? '•••••••• (leave empty to keep)' : 'Initial password (min 6 chars)'}
              addonAfter={
                <Button
                  type="link"
                  size="small"
                  onClick={generateRandomPassword}
                  style={{ padding: 0, height: 'auto', fontSize: 12 }}
                >
                  Generate
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Account Role"
            rules={[{ required: true, message: 'Please select account role.' }]}
          >
            <Select
              options={[
                { value: 'user', label: 'Student (Learning Portal User)' },
                { value: 'admin', label: 'Administrator (Admin Panel Access)' },
              ]}
            />
          </Form.Item>

          <Form.Item name="isActive" label="Account Active" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

