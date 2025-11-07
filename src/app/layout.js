import { Public_Sans } from "next/font/google";
import CustomLayout from "@/components/CustomLayout";
import Script from "next/script";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import ThemeDataProvider from "@/context/ThemeDataProvider";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Edify Parntner Portal",
  description: "Edify Parntner Portal is B2B Partner Portal from Edify Group of Companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} antialiased`}
      >
        <Theme>
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeDataProvider>
              <CustomLayout>
                {children}
              </CustomLayout>
            </ThemeDataProvider>
          </NextThemesProvider>
        </Theme>

        <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></Script>
        <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></Script>
      </body>
    </html>
  );
}
