import { CountdownStrip } from "../components/CountdownStrip";
import { Differential } from "../components/Differential";
import { Faq } from "../components/Faq";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Marquee } from "../components/Marquee";
import { Nav } from "../components/Nav";
import { Plans } from "../components/Plans";
import { Reveal } from "../components/Reveal";
import { Transparency } from "../components/Transparency";

export default function Home() {
  return (
    <>
      <Nav />
      <CountdownStrip />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Differential />
      <Transparency />
      <Plans />

      <section className="section-pad" id="faq">
        <div className="wrap">
          <Reveal className="sec-head" style={{ textAlign: "center", marginInline: "auto" }}>
            <span className="eyebrow">Perguntas frequentes</span>
            <h2 className="sec-title">Sem letra miúda.</h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
          <Reveal
            className="respband"
            style={{ margin: "34px auto 0", maxWidth: 560, justifyContent: "center" }}
          >
            <span className="seal18">+18</span>
            Aposte com responsabilidade. Jogue com moderação.
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
