import type { Metadata } from "next";
import Providers from "@/src/components/providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Challenge Cometa",
	description: "Challenge Cometa - Planetas y cuerpos celestes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es-AR">
			<body className="bg-white text-black antialiased min-h-screen flex flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
