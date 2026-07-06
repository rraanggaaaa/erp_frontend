'use client';

interface LogoProps {
    collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
    return (
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                A
            </div>
            {!collapsed && (
                <span className="text-xl font-semibold text-gray-800">ALISA</span>
            )}
        </div>
    );
}