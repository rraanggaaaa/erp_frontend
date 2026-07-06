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
        <Row gutter={[12, 12]} className="supplier-stats">
            {statItems.map((item, index) => (
                <Col
                    xs={24}
                    sm={12}
                    lg={6}
                    key={item.title}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <Card
                        className="shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full"
                        styles={{
                            body: {
                                padding: '16px 20px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1 truncate">
                                    {item.title}
                                </p>
                                <div className="flex items-baseline flex-wrap gap-1">
                                    <span className="text-xl sm:text-2xl font-bold" style={{ color: item.color }}>
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
                                            <span className="text-base sm:text-xl">{item.value}</span>
                                        )}
                                        {item.suffix}
                                    </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    {item.trend === 'up' ? (
                                        <RiseOutlined className="text-green-500 text-xs sm:text-sm" />
                                    ) : (
                                        <FallOutlined className="text-red-500 text-xs sm:text-sm" />
                                    )}
                                    <span className={`text-xs sm:text-sm ml-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.trendValue}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ml-2"
                                style={{ backgroundColor: item.bgColor }}
                            >
                                <span className="text-base sm:text-xl">
                                    {item.icon}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
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
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                /* Mobile optimizations */
                @media (max-width: 576px) {
                    .supplier-stats .ant-card {
                        border-radius: 12px;
                    }
                    
                    .supplier-stats .ant-card-body {
                        padding: 14px 16px !important;
                    }
                }
                
                /* Tablet optimizations */
                @media (min-width: 577px) and (max-width: 992px) {
                    .supplier-stats .ant-card-body {
                        padding: 18px 20px !important;
                    }
                }
            `}</style>
        </Row>
    );
}