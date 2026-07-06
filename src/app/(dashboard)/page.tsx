'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, Alert, Tabs, Card, Button, Space, message } from 'antd';
import {
    AppstoreOutlined,
    UnorderedListOutlined,
    ReloadOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { SupplierStats } from '@/components/suppliers/SupplierStats';
import { SupplierList } from '@/components/suppliers/SupplierList';
import { supplierApi, getSupplierStats } from '@/lib/api';
import { Supplier } from '@/types/supplier';

export default function DashboardPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [retryCount, setRetryCount] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0
    });

    // Fetch data dengan retry mechanism
    const fetchData = useCallback(async (retry = false) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching suppliers data...', retry ? '(Retry attempt)' : '');

            const response = await supplierApi.getAll({
                limit: 50,
                page: 1
            });

            console.log('API Response:', response);

            if (response.success) {
                // Response structure: { data: { items: [], pagination: {} } }
                const items = response.data?.items || [];
                const paginationData = response.data?.pagination || {};

                setSuppliers(items);
                setPagination({
                    page: paginationData.page || 1,
                    limit: paginationData.limit || 50,
                    total: paginationData.total || items.length
                });

                console.log(`Successfully loaded ${items.length} suppliers`);
                console.log(`Total suppliers: ${paginationData.total || items.length}`);
            } else {
                const errorMsg = response.message || 'Failed to fetch suppliers data';
                setError(errorMsg);
                console.error('API Error:', errorMsg);
            }
        } catch (error: any) {
            console.error('Error fetching data:', error);

            // Cek apakah error karena CORS atau network
            if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
                setError('Unable to connect to the server. Please check your network connection or CORS configuration.');
            } else if (error.response?.status === 404) {
                setError('API endpoint not found. Please check the API URL configuration.');
            } else if (error.response?.status === 500) {
                setError('Server error occurred. Please try again later.');
            } else {
                setError('Failed to connect to the server. Please try again later.');
            }

            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle retry
    const handleRetry = useCallback(() => {
        setRetryCount(prev => prev + 1);
        fetchData(true);
    }, [fetchData]);

    // Filter suppliers berdasarkan tab
    const filteredSuppliers = useMemo(() => {
        switch (activeTab) {
            case 'active':
                return suppliers.filter(s => s.status === 'Active');
            case 'in-progress':
                return suppliers.filter(s => s.status === 'In Progress');
            case 'blocked':
                return suppliers.filter(s => s.status === 'Blocked');
            default:
                return suppliers;
        }
    }, [suppliers, activeTab]);

    // Stats dengan memoization
    const stats = useMemo(() => {
        return getSupplierStats(suppliers);
    }, [suppliers]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin
                    size="large"
                    description="Loading suppliers data..."
                />
            </div>
        );
    }

    // Error state dengan action
    if (error) {
        return (
            <div className="space-y-4">
                <Alert
                    message="Error Loading Data"
                    description={
                        <div className="space-y-2">
                            <p>{error}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    onClick={handleRetry}
                                    loading={loading}
                                >
                                    Retry
                                </Button>
                                <Button
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
                                </Button>
                            </div>
                            {retryCount > 2 && (
                                <div className="mt-2 text-sm text-gray-500">
                                    <WarningOutlined className="mr-1" />
                                    Multiple retry attempts failed. Please check:
                                    <ul className="list-disc list-inside mt-1 ml-2">
                                        <li>API URL configuration in .env.local</li>
                                        <li>CORS settings on the backend</li>
                                        <li>Network connection</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    }
                    type="error"
                    showIcon
                    className="mb-4"
                />
            </div>
        );
    }

    // Empty state
    if (suppliers.length === 0) {
        return (
            <div className="space-y-6">
                <SupplierStats stats={stats} />
                <Card className="shadow-sm">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No Suppliers Found</h3>
                        <p className="text-gray-500 mb-4">Start by adding your first supplier</p>
                        <Button type="primary" href="/suppliers/new">
                            Add New Supplier
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Tab items dengan data yang sudah difilter
    const tabItems = [
        {
            key: 'all',
            label: `All Suppliers (${suppliers.length})`,
            children: (
                <SupplierList
                    initialSuppliers={filteredSuppliers}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onRefresh={handleRetry}
                    pagination={pagination}
                />
            ),
        },
        {
            key: 'active',
            label: `Active (${suppliers.filter(s => s.status === 'Active').length})`,
            children: (
                <SupplierList
                    initialSuppliers={suppliers.filter(s => s.status === 'Active')}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onRefresh={handleRetry}
                />
            ),
        },
        {
            key: 'in-progress',
            label: `In Progress (${suppliers.filter(s => s.status === 'In Progress').length})`,
            children: (
                <SupplierList
                    initialSuppliers={suppliers.filter(s => s.status === 'In Progress')}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onRefresh={handleRetry}
                />
            ),
        },
        {
            key: 'blocked',
            label: `Blocked (${suppliers.filter(s => s.status === 'Blocked').length})`,
            children: (
                <SupplierList
                    initialSuppliers={suppliers.filter(s => s.status === 'Blocked')}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onRefresh={handleRetry}
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Section */}
            <SupplierStats stats={stats} />

            {/* Refresh Button */}
            <div className="flex justify-end">
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRetry}
                    loading={loading}
                >
                    Refresh Data
                </Button>
            </div>

            {/* Main Content */}
            <Card
                className="shadow-sm"
                styles={{
                    body: { padding: '24px' }
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    tabBarExtraContent={
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">View:</span>
                            <Button
                                type={viewMode === 'list' ? 'primary' : 'text'}
                                icon={<UnorderedListOutlined />}
                                onClick={() => setViewMode('list')}
                                className="flex items-center"
                            />
                            <Button
                                type={viewMode === 'grid' ? 'primary' : 'text'}
                                icon={<AppstoreOutlined />}
                                onClick={() => setViewMode('grid')}
                                className="flex items-center"
                            />
                        </div>
                    }
                />
            </Card>
        </div>
    );
}