import "../src/index.css";

// Next.js route layouts must export metadata.
// oxlint-disable-next-line react/only-export-components
export const metadata = {
  title: "WeGrow ConnectX Admin",
  description: "Manage employees and channels in WeGrow ConnectX.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
