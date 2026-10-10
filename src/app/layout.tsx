import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EcoGrid AI — Smart Waste Intelligence & Energy Optimization Platform',
  description:
    'AWS-powered sustainability command center: intelligent waste classification, IoT smart bins, 2-opt collection routing, energy anomaly detection, and renewable energy intelligence.',
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#f4f7f5] text-gray-900">
        {children}
      </body>
    </html>
  );
}
