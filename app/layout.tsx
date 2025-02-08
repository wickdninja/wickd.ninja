import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React

const jetBrains = JetBrains_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetBrains.className}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

