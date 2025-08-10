import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

/**
 * MainLayout component acts as the main wrapper for the app.
 * It renders the Navbar at the top, Footer at the bottom,
 * and the routed child components in the middle via <Outlet />.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <Navbar />

      {/* Main content area grows to fill space between Navbar and Footer */}
      <main className="flex-grow pt-16 relative z-10">
        <Outlet />
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default MainLayout;
