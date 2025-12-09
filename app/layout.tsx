import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "미소♡찌개 - 한국과 일본을 잇는 특별한 인연",
  description: "한일 커플 매칭 플랫폼. 진정한 연결을 만드는 프리미엄 한일 매칭 서비스",
  keywords: ["한일커플", "국제연애", "매칭앱", "한일교류", "韓日カップル"],
  openGraph: {
    title: "미소♡찌개 - 한국과 일본을 잇는 특별한 인연",
    description: "한일 커플 매칭 플랫폼",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <Toaster />
        
        {/* Firebase SDK - CDN 방식 */}
        <Script
          type="module"
          id="firebase-init"
          strategy="afterInteractive"
        >
          {`
            // Import the functions you need from the SDKs you need
            import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
            import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

            // Your web app's Firebase configuration
            const firebaseConfig = {
              apiKey: "AIzaSyDGdQiDM3ExFNVAxOMPi9-hrceYisrPvrg",
              authDomain: "miso-1ee7b.firebaseapp.com",
              projectId: "miso-1ee7b",
              storageBucket: "miso-1ee7b.firebasestorage.app",
              messagingSenderId: "465431937526",
              appId: "1:465431937526:web:441dfef452919dea8447d7",
              measurementId: "G-QXCHCBF35H"
              databaseURL:https://miso-1ee7b-default-rtdb.asia-southeast1.firebasedatabase.app/
            };

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            
            // 전역 객체로 내보내기 (다른 곳에서 사용 가능하도록)
            window.firebaseApp = app;
            window.firebaseAnalytics = analytics;
          `}
        </Script>
      </body>
    </html>
  )
}
