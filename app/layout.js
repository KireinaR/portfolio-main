import { cookies } from 'next/headers';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Ujaan Mukherjee',
  description: 'Ujaan Mukherjee. Computer science undergraduate who builds software and studies the algorithms underneath it.',
  authors: [{ name: 'Ujaan Mukherjee' }],
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script src="/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
