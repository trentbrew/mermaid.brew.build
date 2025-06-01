'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense fallback={null}>
        <body className="overflow-hidden">{children}</body>
      </Suspense>
    </html>
  );
}
