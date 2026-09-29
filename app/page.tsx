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
      <ScrollReveal direction="left">
        <About />
      </ScrollReveal>
      <ScrollReveal direction="right">
        <Skills />
      </ScrollReveal>
      <ScrollReveal direction="left">
        <Projects />
      </ScrollReveal>
      <ScrollReveal direction="right">
        <Journey />
      </ScrollReveal>
      <ScrollReveal direction="left">
        <Contact />
      </ScrollReveal>
      <ScrollReveal direction="right">
        <Footer />
      </ScrollReveal>
    </main>
  );
}
