'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Typography, Tag, Spin } from 'antd';
import { Supplier } from '@/types/supplier';
import { supplierApi } from '@/lib/api';

const { Title, Text } = Typography;

export default function SupplierReviewPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await supplierApi.getAll({ limit: 20, page: 1 });
      if (response.success) {
        setSuppliers(response.data.items || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">Review & Approvals</Title>
        <Text type="secondary">Track supplier status and pending review actions.</Text>
      </div>

      <Card className="shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={suppliers}
            rowKey="id"
            columns={[
              { title: 'Supplier Name', dataIndex: 'supplier_name', key: 'supplier_name' },
              { title: 'Code', dataIndex: 'supplier_code', key: 'supplier_code' },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => <Tag color={status === 'Active' ? 'green' : status === 'Blocked' ? 'red' : 'blue'}>{status}</Tag>,
              },
              { title: 'Contact', dataIndex: 'contact', key: 'contact' },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
