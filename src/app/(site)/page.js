import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import FeaturedRequests from "@/components/home/FeaturedRequests";
import HowItWorks from "@/components/home/HowItWorks";
import Compatibility from "@/components/home/Compatibility";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import Faq from "@/components/home/Faq";
import ContactCta from "@/components/home/ContactCta";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturedRequests />
      <HowItWorks />
      <Compatibility />
      <Testimonials />
      <BlogPreview />
      <Faq />
      <ContactCta />
    </>
  );
}
