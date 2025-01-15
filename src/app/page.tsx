// app/page.tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';

/**
 * Home page component serving as the main landing page.
 * Implements a dark theme with full viewport height.
 * @returns Root layout with navigation and hero section
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
    </main>
  );
}