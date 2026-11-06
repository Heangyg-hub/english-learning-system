import { Spin } from 'antd';

export default function PageLoader({ tip = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
      <Spin size="large" />
      <span style={{ color: '#64748b', fontSize: '14px' }}>{tip}</span>
    </div>
  );
}

