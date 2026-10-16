import "./globals.css";

export const metadata = {
  title: "WeGrow ConnectX | Login",
  description: "Sign in to WeGrow ConnectX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}