import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConfigProvider, App } from 'antd';
import idID from 'antd/locale/id_ID';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ALISA - Supplier Management',
  description: 'Enterprise Supplier Management System',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
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
          <App>
            {children}
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}