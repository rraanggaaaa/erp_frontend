'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, message, Spin } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { supplierApi } from '@/lib/api';
import { Supplier } from '@/types/supplier';

const { Title, Text } = Typography;

export default function EditSupplierPage() {
  const params = useParams();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await supplierApi.getById(params.id as string);
      if (response.success) {
        setSupplier(response.data as Supplier);
      }
      setLoading(false);
    };

    load();
  }, [params.id]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    const response = await supplierApi.update(params.id as string, values);
    if (response.success) {
      message.success('Supplier updated successfully');
      router.push('/dashboard/suppliers');
      return;
    }

    throw new Error(response.message || 'Failed to update supplier');
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-1">Edit Supplier</Title>
        <Text type="secondary">Modify supplier details and sync them to the backend API.</Text>
      </div>

      <Card className="shadow-sm">
        {supplier ? <SupplierForm initialValues={supplier} onSubmit={handleSubmit} submitText="Update Supplier" /> : null}
      </Card>
    </div>
  );
}
