import './globals.css';

export const metadata = {
  title: 'U.S. Open Pick 3 Live',
  description: 'Live Pick 3 golf pool leaderboard for the 126th U.S. Open.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
