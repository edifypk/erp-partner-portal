import { Public_Sans } from "next/font/google";
import "./globals.css";
import CustomLayout from "@/components/CustomLayout";
import Script from "next/script";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Edify Parntner Portal",
  description: "Edify Parntner Portal is B2B Partner Portal from Edify Group of Companies",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} antialiased`}
      >
        <CustomLayout>
          {children}
        </CustomLayout>

        <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></Script>
        <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></Script>
      </body>
    </html>
  );
}
