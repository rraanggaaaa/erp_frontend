'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, Typography, message } from 'antd';
import { Supplier } from '@/types/supplier';

const { Title, Text } = Typography;

interface SupplierFormProps {
  initialValues?: Partial<Supplier>;
  onSubmit?: (values: Partial<Supplier>) => Promise<void> | void;
  onCancel?: () => void;
  submitText?: string;
}

export function SupplierForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText = 'Save Supplier',
}: SupplierFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = async (values: Partial<Supplier>) => {
    try {
      setSubmitting(true);
      await onSubmit?.(values);
    } catch {
      message.error('Unable to save supplier right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-1">Supplier Details</Title>
        <Text type="secondary">Fill in the supplier profile to sync it with your ERP backend.</Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
        <Row gutter={16}>
          <Col span={24} md={12}>
            <Form.Item
              name="supplier_name"
              label="Supplier Name"
              rules={[{ required: true, message: 'Please enter supplier name' }]}
            >
              <Input placeholder="e.g. PT Sinar Jaya" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="nickname" label="Nickname">
              <Input placeholder="Alias / short name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24} md={12}>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Blocked">Blocked</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="supplier_code" label="Supplier Code">
              <Input placeholder="Auto generated if empty" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24} md={12}>
            <Form.Item name="contact" label="Contact Person">
              <Input placeholder="Person in charge" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="email" label="Email">
              <Input placeholder="supplier@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24} md={12}>
            <Form.Item name="phone" label="Phone Number">
              <Input placeholder="0812xxxx" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="mobile" label="Mobile Number">
              <Input placeholder="08xx" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={3} placeholder="Street, building, postal code" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={24} md={12}>
            <Form.Item name="city" label="City">
              <Input placeholder="Jakarta" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="country" label="Country">
              <Input placeholder="Indonesia" />
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitText}
          </Button>
          {onCancel ? (
            <Button onClick={onCancel}>Cancel</Button>
          ) : null}
        </Space>
      </Form>
    </div>
  );
}
