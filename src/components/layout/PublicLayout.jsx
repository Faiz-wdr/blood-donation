import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PublicLayout:
 * Standard wrapper for public facing landing and request/register pages.
 * Includes sticky Navbar and minimal Footer.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#151515] font-sans selection:bg-[#D92735] selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

