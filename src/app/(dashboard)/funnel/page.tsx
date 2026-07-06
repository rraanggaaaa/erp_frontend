'use client';

import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

export default function FunnelPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-1">Funnel Management</Title>
        <Text type="secondary">Monitor supplier sourcing stages and approvals.</Text>
      </div>

      <Card className="shadow-sm">
        <p className="text-gray-600">This module is ready for your sourcing and approval workflow.</p>
      </Card>
    </div>
  );
}
