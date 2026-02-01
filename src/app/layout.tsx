import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast-context';
import { Toast } from '@/components/ui/toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TensorEval - CI/CD for AI Agents',
  description:
    'The CI/CD platform built for deterministic AI evaluation. Catch regressions, latency spikes, and hallucinations before they reach production.',
  metadataBase: new URL('https://tensoreval.com'),
  keywords: [
    'AI evaluation',
    'CI/CD',
    'AI agents',
    'LLM testing',
    'machine learning',
    'regression testing',
  ],
  authors: [{ name: 'TensorEval' }],
  openGraph: {
    title: 'TensorEval - CI/CD for AI Agents',
    description:
      'The CI/CD platform built for deterministic AI evaluation. Catch regressions, latency spikes, and hallucinations before they reach production.',
    type: 'website',
    url: 'https://tensoreval.com',
    siteName: 'TensorEval',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'TensorEval - CI/CD for AI Agents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TensorEval - CI/CD for AI Agents',
    description:
      'The CI/CD platform built for deterministic AI evaluation. Catch regressions, latency spikes, and hallucinations before they reach production.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols for MCP Marketplace icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
