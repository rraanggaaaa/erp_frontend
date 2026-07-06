'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    Input,
    Button,
    Space,
    Tag,
    Modal,
    Form,
    Select,
    Row,
    Col,
    message,
    Tooltip,
    Dropdown,
    Avatar,
    Card,
    Empty,
    Badge,
    Typography,
    Divider
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    ExportOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    EyeOutlined,
    StopOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { Supplier } from '@/types/supplier';
import { supplierApi } from '@/lib/api';

const { Text } = Typography;

interface SupplierListProps {
    initialSuppliers: Supplier[];
    viewMode?: 'list' | 'grid';
    onViewModeChange?: (mode: 'list' | 'grid') => void;
    onRefresh?: () => void;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}

export function SupplierList({
    initialSuppliers,
    viewMode = 'list',
    onViewModeChange,
    onRefresh,
    pagination
}: SupplierListProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        setSuppliers(initialSuppliers);
    }, [initialSuppliers]);

    const getStatusConfig = (status: string) => {
        const configs = {
            'Active': {
                color: 'success',
                text: 'Active',
                icon: <CheckCircleOutlined />,
                bg: 'bg-green-50 text-green-700'
            },
            'In Progress': {
                color: 'processing',
                text: 'In Progress',
                icon: <ClockCircleOutlined />,
                bg: 'bg-blue-50 text-blue-700'
            },
            'Blocked': {
                color: 'error',
                text: 'Blocked',
                icon: <StopOutlined />,
                bg: 'bg-red-50 text-red-700'
            },
        };
        return configs[status as keyof typeof configs] || configs['Active'];
    };

    const columns = [
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            render: (text: string, record: Supplier) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        size={40}
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <div className="font-semibold text-gray-900">{text}</div>
                        <div className="text-xs text-gray-500">Code: {record.supplier_code}</div>
                        {record.nickname && (
                            <div className="text-xs text-gray-400">Nickname: {record.nickname}</div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = getStatusConfig(status);
                return (
                    <Badge
                        status={config.color as any}
                        text={
                            <span className="font-medium">
                                {config.text}
                            </span>
                        }
                    />
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: Supplier) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            className="hover:text-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            className="hover:text-blue-600"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'block',
                                    icon: <StopOutlined />,
                                    label: 'Block Supplier',
                                    danger: true,
                                },
                                {
                                    key: 'delete',
                                    icon: <DeleteOutlined />,
                                    label: 'Delete',
                                    danger: true,
                                    onClick: () => handleDelete(record.id),
                                },
                            ]
                        }}
                        placement="bottomRight"
                    >
                        <Button type="text" icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        form.setFieldsValue(supplier);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Delete Supplier',
            content: 'Are you sure you want to delete this supplier? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            icon: <DeleteOutlined />,
            onOk: async () => {
                try {
                    const response = await supplierApi.delete(id);
                    if (response.success) {
                        message.success('Supplier deleted successfully');
                        setSuppliers(suppliers.filter(s => s.id !== id));
                        if (onRefresh) onRefresh();
                    }
                } catch (error) {
                    message.error('Failed to delete supplier');
                }
            },
        });
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingSupplier) {
                await supplierApi.update(editingSupplier.id, values);
                message.success('Supplier updated successfully');
            } else {
                await supplierApi.create(values);
                message.success('Supplier created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            setEditingSupplier(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error('Failed to save supplier');
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.supplier_code?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.nickname?.toLowerCase().includes(search.toLowerCase())
    );

    // Grid view cards
    const renderGridView = () => {
        if (filteredSuppliers.length === 0) {
            return (
                <Empty
                    description="No suppliers found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }

        return (
            <Row gutter={[16, 16]}>
                {filteredSuppliers.map((supplier) => {
                    const statusConfig = getStatusConfig(supplier.status);
                    return (
                        <Col xs={24} sm={12} lg={8} xl={6} key={supplier.id}>
                            <Card
                                className="hover:shadow-lg transition-all duration-300"
                                styles={{
                                    body: { padding: '16px' }
                                }}
                                actions={[
                                    <EyeOutlined key="view" className="text-blue-600" />,
                                    <EditOutlined key="edit" className="text-blue-600" onClick={() => handleEdit(supplier)} />,
                                    <MoreOutlined key="more" />
                                ]}
                            >
                                <div className="text-center">
                                    <Avatar
                                        size={64}
                                        style={{ backgroundColor: '#1890ff' }}
                                        icon={<UserOutlined />}
                                        className="mb-3"
                                    />
                                    <h3 className="font-semibold text-lg mb-1">{supplier.supplier_name}</h3>
                                    <p className="text-sm text-gray-500 mb-1">Code: {supplier.supplier_code}</p>
                                    {supplier.nickname && (
                                        <p className="text-sm text-gray-400 mb-2">Nickname: {supplier.nickname}</p>
                                    )}
                                    <Badge
                                        status={statusConfig.color as any}
                                        text={statusConfig.text}
                                        className="mb-3"
                                    />
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    return (
        <div className="space-y-4">
            {/* Search and Actions */}
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={12}>
                    <Input
                        placeholder="Search by name, code, or nickname..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={24} md={12}>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Tooltip title="Refresh">
                            <Button
                                icon={<ReloadOutlined />}
                                size="large"
                                onClick={onRefresh}
                            />
                        </Tooltip>
                        <Button
                            icon={<ExportOutlined />}
                            size="large"
                        >
                            Export
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => {
                                setEditingSupplier(null);
                                form.resetFields();
                                setModalVisible(true);
                            }}
                        >
                            New Supplier
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Table or Grid View */}
            {viewMode === 'list' ? (
                <Table
                    columns={columns}
                    dataSource={filteredSuppliers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: pagination?.total || filteredSuppliers.length,
                        pageSize: pagination?.limit || 10,
                        current: pagination?.page || 1,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} suppliers`
                    }}
                    className="shadow-sm"
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                />
            ) : (
                renderGridView()
            )}

            {/* Supplier Form Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                            <UserOutlined />
                        </div>
                        <span className="text-lg font-semibold">
                            {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                        </span>
                    </div>
                }
                open={modalVisible}
                onOk={handleModalSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingSupplier(null);
                }}
                width={600}
                okText={editingSupplier ? 'Update' : 'Create'}
                cancelText="Cancel"
                okButtonProps={{ size: 'large' }}
                cancelButtonProps={{ size: 'large' }}
            >
                <Divider className="my-4" />
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editingSupplier || {}}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="supplier_name"
                                label="Supplier Name"
                                rules={[{ required: true, message: 'Please input supplier name' }]}
                            >
                                <Input placeholder="Enter supplier name" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="supplier_code"
                                label="Supplier Code"
                                rules={[{ required: true, message: 'Please input supplier code' }]}
                            >
                                <Input placeholder="Enter supplier code" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="nickname"
                                label="Nick Name"
                            >
                                <Input placeholder="Enter nickname" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Select placeholder="Select status" size="large">
                                    <Select.Option value="Active">
                                        <Badge status="success" text="Active" />
                                    </Select.Option>
                                    <Select.Option value="In Progress">
                                        <Badge status="processing" text="In Progress" />
                                    </Select.Option>
                                    <Select.Option value="Blocked">
                                        <Badge status="error" text="Blocked" />
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}