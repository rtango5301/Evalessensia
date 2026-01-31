import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

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
      <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
