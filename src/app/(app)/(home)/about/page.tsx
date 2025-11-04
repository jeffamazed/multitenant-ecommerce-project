import { Metadata } from "next";

import { HeroSection } from "@/modules/about/ui/views/hero-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Monavo, the multitenant e-commerce platform empowering independent stores and connecting shoppers with unique products.",
};

const AboutPage = () => {
  return (
    <>
      <HeroSection />
    </>
  );
};

export default AboutPage;
