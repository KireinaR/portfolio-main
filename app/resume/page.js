import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PdfViewer from '@/components/PdfViewer';

export const metadata = {
  title: 'Resume - Ujaan Mukherjee',
  description: "Ujaan Mukherjee's resume.",
};

export default function ResumePage() {
  return (
    <>
      <Header active="about" />

      <main id="top">
        <div className="wrap resume-wrap">
          <PdfViewer src="/resume.pdf" fileName="Ujaan Mukherjee - Resume.pdf" />
        </div>
      </main>

      <Footer />
    </>
  );
}
