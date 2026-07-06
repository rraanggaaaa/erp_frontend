'use client';

import { Layout, Badge, Dropdown, Avatar, Space } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

export default function Header({ collapsed, onCollapse }: HeaderProps) {
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserSwitchOutlined />,
            label: 'Profile',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    return (
        <AntHeader className="bg-white px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
                <button
                    onClick={() => onCollapse(!collapsed)}
                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <h1 className="text-xl font-semibold text-gray-800 ml-4 m-0">
                    Supplier Management
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Space className="cursor-pointer">
                        <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                        <span className="text-sm text-gray-700 hidden sm:inline">John Doe</span>
                    </Space>
                </Dropdown>
            </div>
        </AntHeader>
    );
}