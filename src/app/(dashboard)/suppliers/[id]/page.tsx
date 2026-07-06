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
    Tabs
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined
} from '@ant-design/icons';
import { supplierApi } from '@/lib/api';
import { Supplier } from '@/types/supplier';

const { Title, Text } = Typography;

export default function SupplierDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupplierDetail();
    }, [params.id]);

    const fetchSupplierDetail = async () => {
        try {
            const response = await supplierApi.getById(params.id as string);
            if (response.success) {
                setSupplier(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch supplier details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const response = await supplierApi.delete(params.id as string);
        if (response.success) {
            message.success('Supplier deleted successfully');
            router.push('/dashboard/suppliers');
            return;
        }

        message.error('Failed to delete supplier');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!supplier) {
        return <div>Supplier not found</div>;
    }

    const tabItems = [
        {
            key: 'details',
            label: 'Details',
            children: (
                <Descriptions bordered column={2} className="mt-4">
                    <Descriptions.Item label="Supplier Code">
                        <Text copyable>{supplier.supplier_code}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={supplier.status === 'Active' ? 'green' : 'red'}>
                            {supplier.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nickname">{supplier.nickname || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Contact">{supplier.contact || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Email">{supplier.email || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{supplier.phone || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Mobile">{supplier.mobile || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>
                        {supplier.address || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="City">{supplier.city || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Country">{supplier.country || '-'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'history',
            label: 'History',
            children: <div>History content here</div>,
        },
        {
            key: 'materials',
            label: 'Materials',
            children: <div>Materials list here</div>,
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
                        <div>
                            <Title level={3} className="mb-1">{supplier.supplier_name}</Title>
                            <div className="flex items-center space-x-4">
                                <Text type="secondary">{supplier.supplier_code}</Text>
                                <Tag color={supplier.status === 'Active' ? 'green' : 'red'}>
                                    {supplier.status}
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <Space>
                        <Button icon={<EditOutlined />} onClick={() => router.push(`/dashboard/suppliers/${supplier.id}/edit`)}>Edit</Button>
                        <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>Delete</Button>
                    </Space>
                </div>
            </Card>

            <Card>
                <Tabs items={tabItems} defaultActiveKey="details" />
            </Card>
        </div>
    );
}