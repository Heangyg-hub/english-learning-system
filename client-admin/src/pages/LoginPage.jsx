import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Checkbox } from 'antd';
import { Icon } from '@iconify/react';
import EducationDegreeIcon from '../components/EducationDegreeIcon';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // "Remember me" state and pre-populated credentials
  const [remember, setRemember] = useState(() => {
    return localStorage.getItem('els_admin_remember_me') !== 'false';
  });

  const rememberedEmail = (() => {
    const isRemember = localStorage.getItem('els_admin_remember_me');
    if (isRemember === 'false') return '';
    return localStorage.getItem('els_admin_remember_email') || 'Sengheang@els.com';
  })();

  const rememberedPassword = (() => {
    const isRemember = localStorage.getItem('els_admin_remember_me');
    if (isRemember === 'false') return '';
    return localStorage.getItem('els_admin_remember_password') || 'Admin@heang123$';
  })();

  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    setRemember(checked);
    if (!checked) {
      localStorage.setItem('els_admin_remember_me', 'false');
      localStorage.removeItem('els_admin_remember_email');
      localStorage.removeItem('els_admin_remember_password');
    } else {
      localStorage.setItem('els_admin_remember_me', 'true');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');

    const shouldRemember = values.remember !== false;
    if (shouldRemember) {
      localStorage.setItem('els_admin_remember_me', 'true');
      if (values.email?.trim()) {
        localStorage.setItem('els_admin_remember_email', values.email.trim());
      }
      if (values.password) {
        localStorage.setItem('els_admin_remember_password', values.password);
      }
    } else {
      localStorage.setItem('els_admin_remember_me', 'false');
      localStorage.removeItem('els_admin_remember_email');
      localStorage.removeItem('els_admin_remember_password');
    }

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
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <EducationDegreeIcon size={56} />
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
            email: rememberedEmail,
            password: rememberedPassword,
            remember: remember,
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
              placeholder="Sengheang@els.com"
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

          {/* Remember me Checkbox */}
          <div style={{ marginBottom: 20 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                checked={remember}
                onChange={handleRememberChange}
                style={{
                  color: '#475569',
                  fontSize: 14,
                  fontWeight: 500,
                  userSelect: 'none',
                }}
              >
                Remember me
              </Checkbox>
            </Form.Item>
          </div>

          <Form.Item style={{ marginTop: 8 }}>
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

          {/* <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Default credentials: <code style={{ color: '#2563eb' }}>Sengheang@els.com</code> / <code style={{ color: '#2563eb' }}>Admin@heang123$</code>
            </Text>
          </div> */}
        </Form>
      </Card>
    </div>
  );
}

