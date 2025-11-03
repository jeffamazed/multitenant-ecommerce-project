import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar } from "@/modules/checkout/ui/components/navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-100">
      <Navbar slug={slug} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
