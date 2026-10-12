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
      <ScrollReveal variant="card" duration={420}>
        <About />
      </ScrollReveal>
      <ScrollReveal variant="card" duration={420}>
        <Skills />
      </ScrollReveal>
      <ScrollReveal variant="card" duration={420}>
        <Projects />
      </ScrollReveal>
      <ScrollReveal variant="card" duration={420}>
        <Journey />
      </ScrollReveal>
      <ScrollReveal variant="card" duration={420}>
        <Contact />
      </ScrollReveal>
      <ScrollReveal variant="card" duration={420}>
        <Footer />
      </ScrollReveal>
    </main>
  );
}
