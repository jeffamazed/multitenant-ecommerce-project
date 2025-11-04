import { Metadata } from "next";

import { HeroSection } from "@/modules/contact/ui/views/hero-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Monavo for support, inquiries, or partnership opportunities with our multitenant e-commerce platform.",
};
const ContactPage = () => {
  return (
    <>
      <HeroSection />
    </>
  );
};

export default ContactPage;
