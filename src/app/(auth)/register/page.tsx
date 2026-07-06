'use client';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      message.success('Account created successfully');
      router.push('/login');
    } catch {
      message.error('Registration failed');
    }
  };

  return (
    <Card className="shadow-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">A</span>
        </div>
        <Title level={3} className="mb-2">Create Account</Title>
        <Text type="secondary">Register to access the supplier dashboard.</Text>
      </div>

      <Form form={form} layout="vertical" size="large" onFinish={onFinish}>
        <Form.Item name="full_name" rules={[{ required: true, message: 'Please enter your full name' }]}> 
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full name" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}> 
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <Text type="secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </Text>
      </div>
    </Card>
  );
}
