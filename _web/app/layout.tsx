import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

// Loading component for navigation
function NavigationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Private Chef - Your Personal Cooking Assistant",
  description: "Manage recipes, track ingredients, and get AI-powered cooking assistance",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <div className="min-h-screen pb-safe">
            <Suspense fallback={<NavigationLoading />}>
              {children}
            </Suspense>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
