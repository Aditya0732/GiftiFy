'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'

export default function LayoutWrapper({ children }) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/login' || pathname === '/signup'

    if (isAuthPage) {
        return children
    }

    return (
        <div className='flex min-h-screen'>
            <div className='min-w-[30%] hidden md:block'>
                <Sidebar />
            </div>
            <div className='flex flex-col flex-grow'>
                <Navbar />
                <main className='flex-grow overflow-auto'>
                    {children}
                </main>
            </div>
        </div>
    )
}