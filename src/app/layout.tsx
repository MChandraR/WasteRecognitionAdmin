import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '@mantine/core/styles.css'; // Wajib diimpor!
import {Notifications} from "@mantine/notifications"
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';

const outfit = Outfit({
  subsets: ["latin"],
});

const myTheme = createTheme({
  // Jika kamu ingin mengubah warna latar belakang komponen secara umum
  components: {
    Paper: {
      defaultProps: {
        bg: 'var(--mantine-color-body)', 
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-[#020617] `}>
        <ThemeProvider  >
          <MantineProvider theme={myTheme}>
            <Notifications position="top-center" zIndex={1000}/>
            <SidebarProvider>{children}</SidebarProvider>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
