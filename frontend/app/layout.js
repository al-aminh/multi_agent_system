import "./globals.css";

export const metadata = {
  title: "Research AI | Multi-Agent Research System",
  description:
    "Explore complex topics, uncover reliable sources, and generate structured research reports with autonomous AI agents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#070809] text-[#F5F5F5] font-sans selection:bg-purple-500/30 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
