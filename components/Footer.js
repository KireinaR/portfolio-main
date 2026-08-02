export default function Footer({ home }) {
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colophon__contact">
          <a href="mailto:ujaanm.dev@gmail.com">ujaanm.dev@gmail.com</a>
          <a href="https://github.com/KireinaR" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/um007/" target="_blank" rel="noopener">LinkedIn</a>
        </div>
        <div className="colophon__inner">
          <span>&copy; <span id="year">2026</span> Ujaan Mukherjee</span>
          {home ? (
            <a href="#top" className="to-top">Return to the fold</a>
          ) : (
            <a href="/" className="to-top">Back to the front page</a>
          )}
        </div>
      </div>
    </footer>
  );
}
