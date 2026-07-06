# ERP Frontend - Supplier Management System

## Project Overview
This is a modern Enterprise Resource Planning (ERP) frontend application for supplier management built with Next.js 14, Ant Design, and TypeScript. The application integrates with Supabase for database and is deployed on Vercel.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Ant Design 5.x
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **API Hosting**: Vercel
- **Styling**: Tailwind CSS + Ant Design
- **State Management**: React Hooks + Context API
- **HTTP Client**: Axios
- **Authentication**: Supabase Auth (JWT)

## Project Structure
src/
├── app/
│ ├── (auth)/ # Authentication routes (no sidebar)
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── register/
│ │ └── page.tsx
│ ├── (dashboard)/ # Main app routes (with sidebar)
│ │ ├── layout.tsx # Dashboard layout
│ │ ├── page.tsx # Dashboard home
│ │ ├── suppliers/
│ │ │ ├── page.tsx # Supplier list
│ │ │ ├── new/
│ │ │ │ └── page.tsx # Create supplier
│ │ │ ├── [id]/
│ │ │ │ ├── page.tsx # Supplier detail
│ │ │ │ └── edit/
│ │ │ │ └── page.tsx # Edit supplier
│ │ │ └── review/
│ │ │ └── page.tsx # Review & approvals
│ │ ├── funnel/
│ │ │ └── page.tsx # Funnel management
│ │ └── configurations/
│ │ └── page.tsx # System settings
│ ├── api/ # API routes (Next.js API)
│ │ └── suppliers/
│ │ └── route.ts
│ ├── layout.tsx # Root layout
│ ├── providers.tsx # Context providers
│ └── globals.css # Global styles
├── components/
│ ├── common/ # Shared components
│ │ ├── Logo.tsx
│ │ ├── Loading.tsx
│ │ └── ErrorBoundary.tsx
│ ├── layout/ # Layout components
│ │ ├── Sidebar.tsx
│ │ ├── Header.tsx
│ │ └── Footer.tsx
│ ├── suppliers/ # Supplier components
│ │ ├── SupplierStats.tsx
│ │ ├── SupplierList.tsx
│ │ ├── SupplierForm.tsx
│ │ ├── SupplierCard.tsx
│ │ ├── SupplierDetail.tsx
│ │ └── SupplierFilters.tsx
│ └── ui/ # Reusable UI components
│ ├── Button.tsx
│ ├── Card.tsx
│ └── Modal.tsx
├── config/ # Configuration
│ ├── antd.ts # Ant Design config
│ ├── supabase.ts # Supabase client
│ └── constants.ts # App constants
├── hooks/ # Custom hooks
│ ├── useSuppliers.ts
│ ├── useAuth.ts
│ └── useDebounce.ts
├── lib/ # Utilities
│ ├── api/
│ │ ├── client.ts # API client
│ │ ├── supplier.ts # Supplier API
│ │ └── auth.ts # Auth API
│ ├── utils/
│ │ ├── format.ts
│ │ ├── validation.ts
│ │ └── helpers.ts
│ └── providers/
│ ├── AuthProvider.tsx
│ └── ThemeProvider.tsx
├── types/ # TypeScript types
│ ├── supplier.ts
│ ├── auth.ts
│ ├── api.ts
│ └── common.ts
├── middleware.ts # Next.js middleware
└── styles/
└── antd-overrides.css

text

## Database Schema (Supabase)

### Suppliers Table
```sql
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_code VARCHAR(50) UNIQUE NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Active',
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  contact VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_name ON suppliers(supplier_name);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON suppliers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
Environment Variables
.env.local
env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api.vercel.app/api/v1

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_REDIRECT_URL=/dashboard

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_IMPORT=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
API Integration
Supabase Client Configuration
typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
API Response Types
typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
Development Commands
bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test
Key Features to Implement
1. Authentication (Supabase Auth)
Login with email/password

Registration

Password reset

Session management

Protected routes

Role-based access control

2. Supplier Management (CRUD)
List suppliers with pagination

Create new supplier

View supplier details

Edit supplier

Delete supplier

Filter and search

Export to CSV/Excel

3. Dashboard & Analytics
Supplier statistics

Charts and graphs

Recent activities

Performance metrics

4. Advanced Features
Supplier assessment workflow

Review & approvals

Funnel management

Document upload

History & audit logs

Notifications

Component Development Guidelines
1. Use Ant Design Components
typescript
// Always import from antd
import { Table, Card, Button, Form, Input, Modal, message } from 'antd';
2. Use TypeScript Interfaces
typescript
// Define types for props
interface SupplierListProps {
  suppliers: Supplier[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
3. Custom Hooks for Data Fetching
typescript
// src/hooks/useSuppliers.ts
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    // Implementation
  }, []);

  // Return state and functions
  return { suppliers, loading, error, fetchSuppliers };
}
4. Error Handling
typescript
try {
  // API call
} catch (error) {
  message.error('Failed to perform action');
  console.error('Error:', error);
}
5. Loading States
typescript
// Use Spin for loading
{loading ? (
  <Spin size="large" tip="Loading..." />
) : (
  <Table dataSource={data} columns={columns} />
)}
Styling Guidelines
1. Use Tailwind with Ant Design
typescript
// Combine Ant Design and Tailwind classes
<Card className="shadow-sm hover:shadow-lg transition-all duration-300">
  {/* Content */}
</Card>
2. Responsive Design
typescript
// Use Ant Design Grid system
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    {/* Content */}
  </Col>
</Row>
3. Custom Theme
typescript
// src/config/antd.ts
export const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
};
Deployment (Vercel)
Configuration
json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
Deployment Commands
bash
# Deploy to Vercel
vercel --prod

# Preview deployment
vercel
Common Issues & Solutions
1. Ant Design Styling Issues
typescript
// Solution: Disable Tailwind preflight
// tailwind.config.ts
{
  corePlugins: {
    preflight: false,
  }
}
2. Supabase Session Management
typescript
// Solution: Use middleware for session handling
// src/middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('sb-session');
  // Handle redirects
}
3. API Rate Limiting
typescript
// Solution: Implement debounce for search
const debouncedSearch = useDebounce(searchValue, 500);
Performance Optimization
1. Image Optimization
typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
  priority
/>
2. Code Splitting
typescript
// Lazy load components
const SupplierForm = dynamic(() => import('@/components/SupplierForm'), {
  loading: () => <Spin />,
});
3. API Caching
typescript
// Use SWR or React Query
import useSWR from 'swr';

const { data, error } = useSWR('/api/suppliers', fetcher);
Testing Strategy
1. Unit Tests (Jest)
typescript
describe('SupplierList Component', () => {
  it('renders supplier data correctly', () => {
    // Test implementation
  });
});
2. Integration Tests (Cypress)
typescript
describe('Supplier Management', () => {
  it('creates a new supplier', () => {
    // Test implementation
  });
});
File Naming Conventions
Components: PascalCase (SupplierList.tsx)

Hooks: camelCase with 'use' prefix (useSuppliers.ts)

Utilities: camelCase (formatDate.ts)

Types: camelCase (supplier.ts)

Constants: UPPER_SNAKE_CASE (API_CONFIG.ts)

Git Workflow
bash
# Feature branch
git checkout -b feature/supplier-management

# Commit message format
feat: Add supplier list component
fix: Fix pagination issue
docs: Update API documentation
style: Format code with prettier
refactor: Improve code structure
test: Add unit tests for supplier service
Additional Resources
Next.js Documentation

Ant Design Documentation

Supabase Documentation

TypeScript Documentation

Tailwind CSS Documentation

Developer Notes
When Adding New Features:
Create types in src/types/

Add API functions in src/lib/api/

Create components in src/components/

Add page routes in src/app/

Add navigation in sidebar

Write tests

Update documentation

When Modifying Database:
Update types in src/types/supplier.ts

Update API functions

Update UI components

Test thoroughly

Update this documentation

Code Review Checklist:
TypeScript types are defined

Error handling is implemented

Loading states are shown

Responsive design works

Performance is optimized

Tests are written

Documentation is updated

Contact & Support
Project Lead: [Your Name]

Repository: [GitHub URL]

API Documentation: [API Docs URL]

Supabase Dashboard: [Supabase Project URL]

Vercel Deployment: [Vercel URL]

text

---

## 📁 **.github/copilot-instructions.md** (Opsional untuk GitHub Copilot)

```markdown
# GitHub Copilot Instructions for ERP Frontend

## Project Context
This is a Next.js 14 ERP application with Ant Design UI library. The app uses Supabase for backend and is deployed on Vercel.

## Coding Style Guidelines

### 1. Component Structure
```typescript
// Always use this structure for components
import { FC, useState, useEffect } from 'react';
import { ComponentNameProps } from '@/types';

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [deps]);
  
  // Handlers
  const handleAction = () => {
    // Implementation
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
2. Import Order
typescript
// 1. React/Next imports
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { Table, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// 3. Local imports (use @ alias)
import { Supplier } from '@/types/supplier';
import { supplierApi } from '@/lib/api/supplier';
import { SupplierList } from '@/components/suppliers/SupplierList';
3. API Calls
typescript
// Always use try-catch for API calls
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await supplierApi.getAll();
    if (response.success) {
      setData(response.data);
    }
  } catch (error) {
    message.error('Failed to fetch data');
    console.error('API Error:', error);
  } finally {
    setLoading(false);
  }
};
4. Form Handling with Ant Design
typescript
// Use Form.useForm() with validation
const [form] = Form.useForm();

const onFinish = (values: any) => {
  // Handle form submission
};

<Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
>
  <Form.Item
    name="supplier_name"
    label="Supplier Name"
    rules={[{ required: true, message: 'Please input supplier name' }]}
  >
    <Input placeholder="Enter supplier name" />
  </Form.Item>
</Form>
5. Type Definitions
typescript
// Always define types for props and state
interface SupplierListProps {
  suppliers: Supplier[];
  loading?: boolean;
  onEdit?: (id: string) => void;
}

// Use utility types when needed
type SupplierStatus = 'Active' | 'In Progress' | 'Blocked';
6. Error Handling Patterns
typescript
// Use message for user feedback
message.success('Operation completed successfully');
message.error('Operation failed');

// Use Modal for confirmations
Modal.confirm({
  title: 'Delete Supplier',
  content: 'Are you sure you want to delete this supplier?',
  onOk: async () => {
    // Delete logic
  },
});
7. Responsive Design
typescript
// Always make components responsive
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    {/* Content that adapts to screen size */}
  </Col>
</Row>
8. Performance Optimization
typescript
// Use React.memo for expensive components
export const SupplierCard = React.memo(({ supplier }: SupplierCardProps) => {
  // Component logic
});

// Use useMemo for computed values
const filteredSuppliers = useMemo(() => {
  return suppliers.filter(s => s.status === 'Active');
}, [suppliers]);

// Use useCallback for functions
const handleEdit = useCallback((id: string) => {
  // Edit logic
}, []);
9. Naming Conventions
Components: PascalCase - SupplierList

Hooks: camelCase with 'use' - useSuppliers

Functions: camelCase - fetchSuppliers

Constants: UPPER_SNAKE_CASE - API_BASE_URL

Types: PascalCase - Supplier

Files: PascalCase for components, camelCase for utilities

10. Ant Design Specific Patterns
typescript
// Use Ant Design's built-in components
<Table
  columns={columns}
  dataSource={data}
  loading={loading}
  pagination={{
    total: totalItems,
    pageSize: 10,
    showSizeChanger: true,
  }}
/>

// Use Ant Design icons
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
11. Path Aliases
typescript
// Use @ alias for imports
import { Supplier } from '@/types/supplier';
import { formatDate } from '@/lib/utils/format';
import { Logo } from '@/components/common/Logo';
12. Supabase Integration
typescript
// Use supabase client from config
import { supabase } from '@/config/supabase';

// Always handle auth state
const { data: { session } } = await supabase.auth.getSession();
Common Code Patterns for Copilot
Pattern 1: List with Actions
typescript
// Use this pattern for lists with CRUD operations
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
      </Space>
    ),
  },
];
Pattern 2: Modal Form
typescript
// Use this pattern for create/edit modals
<Modal
  title="Create Supplier"
  open={modalVisible}
  onOk={handleSubmit}
  onCancel={() => setModalVisible(false)}
>
  <Form form={form} layout="vertical">
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
Pattern 3: Fetch with State
typescript
// Use this pattern for data fetching
const [data, setData] = useState<Supplier[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    message.error('Failed to load data');
  } finally {
    setLoading(false);
  }
};
Pattern 4: Search Filter
typescript
// Use this pattern for search functionality
const [searchText, setSearchText] = useState('');
const filteredData = useMemo(() => {
  return data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
}, [data, searchText]);
Copilot Tips
TypeScript: Always add TypeScript types for better suggestions

Context: Provide file imports at the top

Comments: Use comments to guide Copilot

Patterns: Follow existing patterns in the codebase

Naming: Use descriptive variable names

text

## 📁 **README.md** (Untuk Developer)

```markdown
# ERP Supplier Management System

A modern supplier management system built with Next.js 14, Ant Design, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd erp_frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
Database Setup
Create a new project in Supabase

Run the SQL schema from database/schema.sql

Set up Row Level Security (RLS) policies

Deployment
bash
# Deploy to Vercel
vercel --prod

# Or using Vercel CLI
vercel deploy --prod
📚 Documentation
Project Structure

API Reference

Component Library

Database Schema

🛠️ Built With
Next.js 14 - React Framework

Ant Design - UI Library

Supabase - Backend & Database

TypeScript - Type Safety

Tailwind CSS - Styling

Vercel - Deployment

📝 License
This project is licensed under the MIT License.

text

Dengan file-file ini, GitHub Copilot akan memiliki konteks lengkap tentang project dan dapat memberikan saran yang lebih akurat dan sesuai dengan codebase Anda!