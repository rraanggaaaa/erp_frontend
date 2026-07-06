'use client';

import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    FunnelPlotOutlined,
    SettingOutlined,
    FileAddOutlined,
    CheckCircleOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['dashboard']);
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    useEffect(() => {
        // Update selected keys based on current path
        if (pathname === '/') {
            setSelectedKeys(['dashboard']);
            setOpenKeys([]);
        } else if (pathname.startsWith('/suppliers')) {
            if (pathname === '/suppliers') {
                setSelectedKeys(['supplier-list']);
            } else if (pathname === '/suppliers/new') {
                setSelectedKeys(['supplier-add']);
            } else if (pathname === '/suppliers/review') {
                setSelectedKeys(['supplier-review']);
            } else {
                setSelectedKeys(['supplier-list']);
            }
            setOpenKeys(['supplier-management']);
        } else if (pathname.startsWith('/funnel')) {
            setSelectedKeys(['funnel']);
            setOpenKeys([]);
        } else if (pathname.startsWith('/configurations')) {
            setSelectedKeys(['configurations']);
            setOpenKeys([]);
        } else {
            setSelectedKeys(['dashboard']);
            setOpenKeys([]);
        }
    }, [pathname]);

    // Menu items dengan unique keys
    const menuItems: MenuProps['items'] = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.push('/'),
        },
        {
            key: 'supplier-management',
            icon: <UserOutlined />,
            label: 'Supplier Management',
            children: [
                {
                    key: 'supplier-list',
                    icon: <UnorderedListOutlined />,
                    label: 'Supplier List',
                    onClick: () => router.push('/suppliers'),
                },
                {
                    key: 'supplier-add',
                    icon: <FileAddOutlined />,
                    label: 'Add Supplier',
                    onClick: () => router.push('/suppliers/new'),
                },
                {
                    key: 'supplier-review',
                    icon: <CheckCircleOutlined />,
                    label: 'Review & Approvals',
                    onClick: () => router.push('/suppliers/review'),
                },
            ],
        },
        {
            key: 'funnel',
            icon: <FunnelPlotOutlined />,
            label: 'Funnel Management',
            onClick: () => router.push('/funnel'),
        },
        {
            key: 'configurations',
            icon: <SettingOutlined />,
            label: 'Configurations',
            onClick: () => router.push('/configurations'),
        },
    ];

    // Handle menu click
    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        // Find the item and navigate
        const findAndNavigate = (items: any[]) => {
            for (const item of items) {
                if (item.key === key && item.onClick) {
                    item.onClick();
                    return true;
                }
                if (item.children) {
                    const found = findAndNavigate(item.children);
                    if (found) return true;
                }
            }
            return false;
        };
        findAndNavigate(menuItems);
    };

    // Handle open keys change
    const handleOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            theme="light"
            className="border-r border-gray-200"
            width={240}
            trigger={null}
            style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                overflow: 'auto',
            }}
        >
            <div className="h-16 flex items-center px-4 border-b border-gray-200">
                <Logo collapsed={collapsed} />
            </div>
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                items={menuItems}
                onClick={handleMenuClick}
                onOpenChange={handleOpenChange}
                className="border-0"
                style={{ borderRight: 0 }}
            />
            <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center space-x-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        JD
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 m-0 truncate">John Doe</p>
                            <p className="text-xs text-gray-500 m-0">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </Sider>
    );
}