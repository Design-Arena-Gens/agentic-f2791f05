import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Dashboard',
  description: 'Track daily schedule, goals, assignments, and reminders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Personal Dashboard</h1>
            <p className="subtitle">Daily schedule ? Goals ? Assignments ? Reminders</p>
          </header>
          <main>{children}</main>
          <footer className="footer">Built with Next.js</footer>
        </div>
      </body>
    </html>
  );
}
