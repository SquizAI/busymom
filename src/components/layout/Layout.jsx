import React, { useEffect, useState, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import StickyFooter from './StickyFooter';
import { UserContext } from '../../context/UserContext';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useContext(UserContext) || { user: null };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer className="hidden md:block" />
      {isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;
