"use client";

import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";

export default function AppProviders({ children }) {
  return (
    <CssVarsProvider defaultMode="system" disableTransitionOnChange>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
