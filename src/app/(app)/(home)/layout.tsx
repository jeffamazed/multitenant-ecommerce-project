import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />

      <main className="flex-1 bg-zinc-100 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
