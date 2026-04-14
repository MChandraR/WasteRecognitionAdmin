import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '@mantine/core/styles.css'; // Wajib diimpor!
import {Notifications} from "@mantine/notifications"
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <MantineProvider>
            <Notifications position="top-center" zIndex={1000}/>
            <SidebarProvider>{children}</SidebarProvider>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
