'use client';

import { SessionProvider } from "next-auth/react";
import React from "react";
import { AIProvider } from "@/context/AIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AIProvider>
        {children}
      </AIProvider>
    </SessionProvider>
  );
}
