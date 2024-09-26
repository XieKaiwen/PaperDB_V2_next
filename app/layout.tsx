import { Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";;
import ReactQueryClientProvider from "@/utils/react-query-client/ReactQueryClientProvider";


const merriweather = Merriweather({
  subsets: ["latin"], // Specifies the character subset to load, useful for performance optimization.
  weight: ["400", "700"], // Includes 'normal' and 'bold' weights for diverse typographical emphasis.
  variable: "--font-merriweather", // Custom CSS variable for easier referencing in your CSS.
});

const openSans = Open_Sans({
  subsets: ["latin"], // Specifies the 'latin' character subset to load.
  variable: "--font-open-sans", // Custom CSS variable for easier referencing in your CSS.
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PaperDB",
  description:
    "Access countless Top School Papers and get the best mugging experience here!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-background antialiased w-full ${merriweather.variable} ${openSans.variable}`}
      >
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
