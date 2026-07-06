'use client';

import { Card, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { supplierApi } from '@/lib/api';

const { Title, Text } = Typography;

export default function NewSupplierPage() {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, unknown>) => {
    const response = await supplierApi.create(values);
    if (response.success) {
      message.success('Supplier created successfully');
      router.push('/dashboard/suppliers');
      return;
    }

    throw new Error(response.message || 'Failed to create supplier');
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-1!">Create Supplier</Title>
        <Text type="secondary">Add a supplier and sync it with your ERP backend.</Text>
      </div>

      <Card className="shadow-sm">
        <SupplierForm onSubmit={handleSubmit} submitText="Create Supplier" />
      </Card>
    </div>
  );
}
