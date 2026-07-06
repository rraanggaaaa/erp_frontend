'use client';

import { Card, Row, Col } from 'antd';
import {
    UserOutlined,
    UserAddOutlined,
    DollarOutlined,
    StopOutlined,
    RiseOutlined,
    FallOutlined
} from '@ant-design/icons';
import { SupplierStats as StatsType } from '@/types/supplier';
import CountUp from 'react-countup';

interface SupplierStatsProps {
    stats: StatsType;
}

export function SupplierStats({ stats }: SupplierStatsProps) {
    const statItems = [
        {
            title: 'Active Total Supplier',
            value: stats.total,
            prefix: '',
            suffix: `+${stats.growth}%`,
            icon: <UserOutlined className="text-blue-500 text-xl" />,
            color: '#1890ff',
            bgColor: '#e6f7ff',
            trend: stats.growth > 0 ? 'up' : 'down',
            trendValue: `${stats.growth}% vs last year`,
            progressWidth: 78,
        },
        {
            title: 'New Supplier',
            value: stats.newSuppliers,
            prefix: '',
            suffix: `+${stats.newGrowth}%`,
            icon: <UserAddOutlined className="text-green-500 text-xl" />,
            color: '#52c41a',
            bgColor: '#f6ffed',
            trend: stats.newGrowth > 0 ? 'up' : 'down',
            trendValue: `${stats.newGrowth}% vs Last Year`,
            progressWidth: 62,
        },
        {
            title: 'Avg Cost per Supplier',
            value: stats.avgCost,
            prefix: 'Rp ',
            suffix: '',
            icon: <DollarOutlined className="text-orange-500 text-xl" />,
            color: '#faad14',
            bgColor: '#fff7e6',
            trend: stats.costGrowth > 0 ? 'up' : 'down',
            trendValue: `${stats.costGrowth}% vs Last Year`,
            progressWidth: 85,
        },
        {
            title: 'Blocked Supplier',
            value: stats.blocked,
            prefix: '',
            suffix: `-${Math.abs(stats.blockedGrowth)}%`,
            icon: <StopOutlined className="text-red-500 text-xl" />,
            color: '#ff4d4f',
            bgColor: '#fff1f0',
            trend: stats.blockedGrowth > 0 ? 'up' : 'down',
            trendValue: `${stats.blockedGrowth}% vs Last Year`,
            progressWidth: 46,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {statItems.map((item) => (
                <Col xs={24} sm={12} lg={6} key={item.title}>
                    <Card
                        className="shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        styles={{
                            body: { padding: '20px' }
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 font-medium mb-1">{item.title}</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold" style={{ color: item.color }}>
                                        {item.prefix}
                                        {typeof item.value === 'number' ? (
                                            <CountUp
                                                start={0}
                                                end={item.value}
                                                duration={2}
                                                separator="."
                                                delay={0.2}
                                                useEasing={true}
                                            />
                                        ) : (
                                            item.value
                                        )}
                                        {item.suffix}
                                    </span>
                                </div>
                                <div className="flex items-center mt-2">
                                    {item.trend === 'up' ? (
                                        <RiseOutlined className="text-green-500 text-sm" />
                                    ) : (
                                        <FallOutlined className="text-red-500 text-sm" />
                                    )}
                                    <span className={`text-sm ml-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.trendValue}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: item.bgColor }}
                            >
                                {item.icon}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="w-full bg-gray-100 rounded-full h-1">
                                <div
                                    className="h-1 rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${item.progressWidth}%`,
                                        backgroundColor: item.color,
                                        animation: 'progressAnimation 1.5s ease-in-out'
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
            <style jsx>{`
                @keyframes progressAnimation {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </Row>
    );
}