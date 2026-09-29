import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <Skills />
      </ScrollReveal>
      <ScrollReveal>
        <Projects />
      </ScrollReveal>
      <ScrollReveal>
        <Journey />
      </ScrollReveal>
      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </main>
  );
}
