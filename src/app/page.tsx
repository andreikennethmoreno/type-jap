import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";


export default function Home() {
  return (
    <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
      <Hero />
      {/* <Feature /> */}
      <Footer />
    </div>
  );
}
