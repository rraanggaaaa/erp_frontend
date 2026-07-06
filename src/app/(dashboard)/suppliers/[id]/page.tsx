'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Spin,
    message,
    Typography,
    Avatar,
    Tabs,
    App,
    Modal
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined
} from '@ant-design/icons';
import { supplierApi } from '@/lib/api/supplier';
import { Supplier } from '@/types/supplier';

const { Title, Text } = Typography;

export default function SupplierDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { message: messageApi } = App.useApp();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchSupplierDetail();
    }, [params.id]);

    const fetchSupplierDetail = async () => {
        try {
            setLoading(true);
            const response = await supplierApi.getById(params.id as string);
            if (response.success) {
                setSupplier(response.data);
            } else {
                messageApi.error('Failed to fetch supplier details');
            }
        } catch (error) {
            console.error('Error fetching supplier:', error);
            messageApi.error('Failed to fetch supplier details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Delete Supplier',
            content: `Are you sure you want to delete "${supplier?.supplier_name}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setDeleting(true);
                    const response = await supplierApi.delete(params.id as string);
                    if (response.success) {
                        messageApi.success('Supplier deleted successfully');
                        router.push('/suppliers');
                    } else {
                        messageApi.error('Failed to delete supplier');
                    }
                } catch (error) {
                    console.error('Error deleting supplier:', error);
                    messageApi.error('Failed to delete supplier');
                } finally {
                    setDeleting(false);
                }
            },
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Active': 'green',
            'In Progress': 'orange',
            'Blocked': 'red',
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" description="Loading supplier details..." />
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <Title level={3}>Supplier Not Found</Title>
                <Text type="secondary">The supplier you're looking for doesn't exist.</Text>
                <div className="mt-4">
                    <Button type="primary" onClick={() => router.push('/suppliers')}>
                        Back to Suppliers
                    </Button>
                </div>
            </div>
        );
    }

    const tabItems = [
        {
            key: 'details',
            label: 'Details',
            children: (
                <Descriptions bordered column={2} className="mt-4">
                    <Descriptions.Item label="Supplier Name" span={2}>
                        <Text strong>{supplier.supplier_name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Supplier Code">
                        <Text copyable>{supplier.supplier_code}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(supplier.status)}>
                            {supplier.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nickname" span={2}>
                        {supplier.nickname || '-'}
                    </Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'history',
            label: 'History',
            children: (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <Text type="secondary">History feature coming soon...</Text>
                </div>
            ),
        },
        {
            key: 'materials',
            label: 'Materials',
            children: (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <Text type="secondary">Materials feature coming soon...</Text>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="mb-4"
            >
                Back
            </Button>

            <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
                        <div>
                            <Title level={3} className="mb-1">{supplier.supplier_name}</Title>
                            <div className="flex flex-wrap items-center gap-2">
                                <Text type="secondary" className="text-sm">
                                    Code: {supplier.supplier_code}
                                </Text>
                                <Tag color={getStatusColor(supplier.status)}>
                                    {supplier.status}
                                </Tag>
                                {supplier.nickname && (
                                    <Text type="secondary" className="text-sm">
                                        Nickname: {supplier.nickname}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}
                        >
                            Edit
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDelete}
                            loading={deleting}
                        >
                            Delete
                        </Button>
                    </Space>
                </div>
            </Card>

            <Card>
                <Tabs items={tabItems} defaultActiveKey="details" />
            </Card>
        </div>
    );
}