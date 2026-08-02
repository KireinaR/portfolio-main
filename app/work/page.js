import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Works - Ujaan Mukherjee',
  description: "Selected works by Ujaan Mukherjee: ARGUS, a physics simulation, an air-bases API, a thermal camera, and more.",
};

const PROJECTS = [
  {
    kicker: 'Machine Vision',
    href: 'https://github.com/KireinaR/argus',
    title: 'ARGUS',
    desc: "Artificial Recognition and Guided User Search: a CLIP-based face search you address in plain language, with GPU acceleration and compact embedding storage. It finds a face the way you'd describe one to a friend.",
    host: 'github.com/KireinaR/argus',
  },
  {
    kicker: 'Physics & Pedagogy',
    href: 'https://ydse-ujaan.vercel.app/',
    title: "Young's Double-Slit",
    desc: 'A browser-native simulation of wave interference, with faithful physics and multi-wavelength rendering. Built as a teaching instrument. Light, made legible.',
    host: 'ydse-ujaan.vercel.app',
  },
  {
    kicker: 'Data & Infrastructure',
    href: 'https://airbases.mris.workers.dev/',
    title: 'Global Military Bases API',
    desc: "A structured API centred on the world's air bases, classified by country and type, deployed to the edge as a Cloudflare Worker for fast, scalable retrieval.",
    host: 'airbases.mris.workers.dev',
  },
  {
    kicker: 'Embedded Systems',
    href: 'https://github.com/KireinaR/heat-seeker/',
    title: 'Heat Seeker',
    desc: 'Real-time thermal tracking on an ESP32 paired with an MLX90640, with live heat-map streaming and temperature-based target detection. A small machine taught to see warmth.',
    host: 'github.com/KireinaR/heat-seeker',
  },
  {
    kicker: 'The Web, Plainly',
    href: 'https://jaagoforchange.vercel.app',
    title: 'JAAGO NGO Website',
    desc: 'A site for a Kolkata-based, student-led NGO. Hand-written vanilla HTML, CSS and JavaScript, no framework, no build step, shipped on Vercel. Proof that plain tools still build good things.',
    host: 'jaagoforchange.vercel.app',
  },
];

export default function WorkPage() {
  return (
    <>
      <Header active="work" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--page">Works</h1>
        </div>

        <div className="wrap">
          <section className="reveal">
            <div className="dispatches">
              {PROJECTS.map((p) => (
                <article className="dispatch" key={p.title}>
                  <p className="dispatch__kicker">{p.kicker}</p>
                  <a className="dispatch__title" href={p.href} target="_blank" rel="noopener">
                    {p.title}
                  </a>
                  <p className="dispatch__desc">{p.desc}</p>
                  <p className="dispatch__host">{p.host}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
