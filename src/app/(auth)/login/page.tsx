'use client';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            message.success('Login successful!');
            router.push('/dashboard');
        } catch {
            message.error('Login failed. Please try again.');
        }
    };

    return (
        <Card className="shadow-xl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl font-bold">A</span>
                </div>
                <Title level={3} className="mb-2">Welcome Back</Title>
                <Text type="secondary">Sign in to your account to continue</Text>
            </div>

            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Username"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Sign In
                    </Button>
                </Form.Item>

                <div className="text-center">
                    <Text type="secondary">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700">
                            Register now
                        </Link>
                    </Text>
                </div>
            </Form>
        </Card>
    );
}