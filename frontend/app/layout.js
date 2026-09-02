import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'CleanHome - Housekeeping Marketplace',
  description: 'Book professional housekeepers online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
