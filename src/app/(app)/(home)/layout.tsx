import { Footer } from "./footer";
import { Navbar } from "./navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-dvh overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-zinc-100">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
