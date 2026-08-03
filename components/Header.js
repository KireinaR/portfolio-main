const LINKS = [
  { key: 'home', href: '/', label: 'Front Page' },
  { key: 'about', href: '/about', label: 'About' },
  { key: 'work', href: '/work', label: 'Works' },
  { key: 'journal', href: '/journal', label: 'Journal' },
  { key: 'guestbook', href: '/guestbook', label: 'Guestbook' },
];

export default function Header({ active }) {
  return (
    <header className="runhead">
      <div className="wrap runhead__inner">
        <a className="runhead__name" href="/">Ujaan Mukherjee</a>
        <nav className="runnav" aria-label="Sections" id="site-nav">
          {LINKS.map((link) => (
            <a key={link.key} href={link.href} className={link.key === active ? 'is-active' : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
        <button className="theme-toggle" type="button" aria-label="Switch colour theme" title="Switch theme">
          <span className="theme-toggle__glyph" aria-hidden="true"></span>
        </button>
        <button className="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="site-nav">
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
        </button>
      </div>
    </header>
  );
}
