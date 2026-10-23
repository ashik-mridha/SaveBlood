import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
