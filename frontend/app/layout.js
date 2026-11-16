import "./globals.css";

export const metadata = {
  title: "The Research Folio — Autonomous Private Research",
  description:
    "An editorial publication and private library environment for structured multi-agent research and critical peer appraisal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#F3EFE6] dark:bg-[#14120F] text-[#1B1F1C] dark:text-[#EDE6D8] font-sans selection:bg-[#1F3D2F]/15 dark:selection:bg-[#B8975A]/25"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
