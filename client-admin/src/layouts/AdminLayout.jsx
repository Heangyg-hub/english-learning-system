import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, theme } from 'antd';
import { Icon } from '@iconify/react';
import EducationDegreeIcon from '../components/EducationDegreeIcon';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <Icon icon="lucide:layout-dashboard" width={20} />,
      label: 'Dashboard',
    },
    {
      key: '/programs',
      icon: <Icon icon="lucide:graduation-cap" width={20} />,
      label: 'Programs & Levels',
    },
    {
      key: '/dictionary',
      icon: <Icon icon="lucide:book-open" width={20} />,
      label: 'Vocabulary Dictionary',
    },
    {
      key: '/users',
      icon: <Icon icon="lucide:users" width={20} />,
      label: 'Student Accounts',
    },
  ];

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>{user?.username}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <Icon icon="lucide:log-out" width={16} />,
      label: 'Sign Out',
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: '#0f172a',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <EducationDegreeIcon size={34} />
          {!collapsed && (
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>English Admin</div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>Curriculum & Lexicon</div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => navigate(item.key),
          }))}
          style={{ background: 'transparent', marginTop: 12, borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={<Icon icon={collapsed ? 'lucide:menu' : 'lucide:panel-left-close'} width={20} />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1e293b' }}>
              {menuItems.find((m) => m.key === location.pathname)?.label || 'Admin Portal'}
            </div>
          </div>

          <Space size={16}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: '#2563eb' }}
                  src={user?.avatar}
                  icon={!user?.avatar && <Icon icon="lucide:user" />}
                />
                <span style={{ fontWeight: 500, color: '#334155' }}>{user?.username}</span>
                <Icon icon="lucide:chevron-down" width={16} color="#64748b" />
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px 24px 0', minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

