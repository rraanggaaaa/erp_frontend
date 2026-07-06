'use client';

import { ConfigProvider } from 'antd';
import idID from 'antd/locale/id_ID';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ConfigProvider
            locale={idID}
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                    fontFamily: 'Inter, sans-serif',
                },
                components: {
                    Layout: {
                        headerBg: '#ffffff',
                        siderBg: '#ffffff',
                    },
                    Menu: {
                        itemSelectedBg: '#e6f7ff',
                        itemSelectedColor: '#1890ff',
                    },
                    Table: {
                        headerBg: '#fafafa',
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}