'use client';

import { useState, useEffect } from 'react';
import { SupplierList } from '@/components/suppliers/SupplierList';
import { supplierApi } from '@/lib/api';
import { Supplier } from '@/types/supplier';
import { Spin, Alert } from 'antd';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await supplierApi.getAll({ limit: 50, page: 1 });
            if (response.success) {
                setSuppliers(response.data.items);
            }
        } catch (error) {
            setError('Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return <SupplierList initialSuppliers={suppliers} />;
}