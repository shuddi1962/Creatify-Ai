import './globals.css';
import { Inter } from "next/font/google";
import { AuthProvider } from '../src/lib/AuthProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Creatify AI — Free AI Image & Video Studio',
  description: 'Generate AI images and videos using 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more. Free open-source alternative to Higgsfield AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('studio_theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`
        }} />
      </head>
      <body className={inter.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
