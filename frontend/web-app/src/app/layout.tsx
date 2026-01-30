"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "@/lib/store/store";
import { useEffect } from "react";
import { fetchToken } from "@/lib/store/tokenSlice";
import { fetchUser } from "@/lib/store/userSlice";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <CheckLoginStatus/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
