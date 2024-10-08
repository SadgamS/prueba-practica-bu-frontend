'use client';
import 'material-icons/iconfont/outlined.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import AlertProvider from '@/context/AlertProvider';
import { AuhtProvider } from '@/context/AuthProvider';
import { FullScreenLoadingProvider } from '@/context/FullScreenLoadingProvider';
import { Suspense } from 'react';
import { BackdropVista } from '@/components/progeso/Backdrop';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main>
          <ThemeRegistry>
            <FullScreenLoadingProvider>
              <AlertProvider>
                <AuhtProvider>
                  <Suspense
                    fallback={<BackdropVista cargando color='primary' titulo='Cargando...' />}
                  >
                    {children}
                  </Suspense>
                </AuhtProvider>
              </AlertProvider>
            </FullScreenLoadingProvider>
          </ThemeRegistry>
        </main>
      </body>
    </html>
  );
}
