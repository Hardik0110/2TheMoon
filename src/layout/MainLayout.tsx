import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-950">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;