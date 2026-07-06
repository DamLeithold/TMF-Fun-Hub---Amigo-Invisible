import "./globals.css";

export const metadata = {
  title: "TMF Fun Hub",
  description: "Amigo Invisible TMF",
  icons: {
    icon: "/tmf-logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
