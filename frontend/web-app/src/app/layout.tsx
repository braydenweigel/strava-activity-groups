"use client"


import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "@/lib/store/store";
import { useEffect } from "react";
import { fetchToken } from "@/lib/store/tokenSlice";
import { ThemeProvider } from "@/components/lib/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function CheckLoginStatus(){
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch((fetchToken()))
  }, [dispatch])

  return null
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <CheckLoginStatus/>
            <main className="">
              {children}
            </main>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
