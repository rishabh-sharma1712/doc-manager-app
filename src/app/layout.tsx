import './globals.css'
import '../styles/dashboard.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { DocumentProvider } from '@/context/DocumentContext'
import { UserProvider } from '@/context/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Document Manager',
  description: 'A modern document management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <DocumentProvider>
              {children}
            </DocumentProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
