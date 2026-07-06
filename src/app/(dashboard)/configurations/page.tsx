'use client';

import { Card, Typography, Switch, Row, Col, Divider } from 'antd';

const { Title, Text } = Typography;

export default function ConfigurationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-1">Configurations</Title>
        <Text type="secondary">Manage ERP frontend preferences and integrations.</Text>
      </div>

      <Card className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Enable Supplier Export</h3>
                <p className="text-sm text-gray-500">Allow exporting supplier data to CSV.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </Col>
          <Col span={24} md={12}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Enable Audit Trail</h3>
                <p className="text-sm text-gray-500">Track supplier changes and review history.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </Col>
        </Row>
        <Divider />
        <div className="text-sm text-gray-500">
          Connected API endpoint: <span className="font-medium text-gray-700">https://erp-backend-5ax6.vercel.app/api/v1</span>
        </div>
      </Card>
    </div>
  );
}
