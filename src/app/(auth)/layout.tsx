'use client';

import { Layout } from 'antd';

const { Content } = Layout;

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Layout className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            <Content className="flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </Content>
        </Layout>
    );
}