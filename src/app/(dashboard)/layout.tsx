'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const { Content } = Layout;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
                <Header collapsed={collapsed} onCollapse={setCollapsed} />
                <Content className="p-6 bg-gray-50">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}