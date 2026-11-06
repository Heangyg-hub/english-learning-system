import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1e293b, #0f172a)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            <Icon icon="lucide:graduation-cap" width={32} />
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>Admin Sign In</Title>
          <Text type="secondary">English Learning Management Panel</Text>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: 'admin@english.com',
            password: 'admin123',
          }}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<Icon icon="lucide:mail" color="#94a3b8" width={18} style={{ marginRight: 6 }} />}
              placeholder="admin@english.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<Icon icon="lucide:lock" color="#94a3b8" width={18} style={{ marginRight: 6 }} />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 46,
                fontWeight: 600,
                background: '#2563eb',
              }}
            >
              Log In to Admin
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Default credentials: <code style={{ color: '#2563eb' }}>admin@english.com</code> / <code style={{ color: '#2563eb' }}>admin123</code>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}

