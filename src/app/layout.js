import { Public_Sans } from "next/font/google";
import "./globals.css";
import "./designkit.css"
import CustomLayout from "@/components/CustomLayout";

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
    <html lang="en">
      <body
        className={`${publicSans.variable} antialiased`}
      >
        <CustomLayout>
          {children}
        </CustomLayout>
      </body>
    </html>
  );
}
