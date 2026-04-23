import "./globals.css";
import { Inter } from "next/font/google";
import AppProviders from "@/components/AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quiz — practice and score",
  description: "Sign in, take timed quizzes, and review your results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
