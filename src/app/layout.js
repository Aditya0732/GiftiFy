import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './AuthProvider'
import LayoutWrapper from '@/LayoutWrapper'
import { Providers } from '@/store/provider'
import Script from 'next/script'
import ToasterProvider from '@/components/ToasterProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Money Gift App',
  description: 'Manage your money gifts easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LayoutWrapper>
            <Providers>{children}<ToasterProvider /></Providers>
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}