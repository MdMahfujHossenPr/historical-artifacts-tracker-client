import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-rose-100">
      <Navbar />
      <main className="flex-grow relative z-10 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;