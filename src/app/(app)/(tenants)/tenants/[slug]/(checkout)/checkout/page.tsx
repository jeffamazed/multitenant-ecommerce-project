import { Metadata } from "next";
import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your items and finish your order smoothly on Monavo Multitenant E-commerce.",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const CheckoutPage = async ({ params }: Props) => {
  const { slug } = await params;
  return <CheckoutView tenantSlug={slug} />;
};

export default CheckoutPage;
