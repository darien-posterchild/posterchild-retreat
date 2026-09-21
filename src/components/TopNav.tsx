import { ChevronDown, Sparkles } from 'lucide-react';
import Logo from './Logo';

type TopNavProps = {
  sessionId: string;
  totalJoined: number;
};

const navItems = [
  { label: 'Home', active: true },
  { label: 'Tell', active: false },
  { label: 'Raise', active: false },
  { label: 'Manage', active: false }
];

export default function TopNav({ sessionId, totalJoined }: TopNavProps) {
  return (
    <header className="pc-topbar" role="banner">
      <div className="pc-topbar__inner">
        {/* Left: Brand logo + Org Switcher */}
        <div className="pc-topbar__left">
          <div className="pc-topbar__brand">
            <Logo size="md" />
          </div>

          <span className="pc-topbar__divider" aria-hidden="true" />

          <button className="pc-org-switcher" type="button" aria-label="Organization: Spelman College">
            <span className="pc-org-avatar">SC</span>
            <span className="pc-org-name">Spelman College</span>
            <ChevronDown size={13} className="pc-org-chevron" />
          </button>
        </div>

        {/* Center: Real PosterChild product navigation */}
        <nav className="pc-nav-tabs" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`pc-nav-tab ${item.active ? 'is-active' : ''}`}
              aria-current={item.active ? 'page' : undefined}
            >
              <span>{item.label}</span>
              {item.active && <span className="pc-nav-tab__indicator" aria-hidden="true" />}
            </button>
          ))}
        </nav>

        {/* Right: Postie Trigger, Session Presence, Profile */}
        <div className="pc-topbar__right">
          {/* Postie AI Presence / Assistant trigger */}
          <div className="pc-postie-pill" title="Postie AI Assistant active">
            <div className="pc-postie-pill__icon">
              <Sparkles size={13} />
            </div>
            <span className="pc-postie-pill__label">Postie</span>
            <span className="pc-postie-pill__badge">3 suggestions</span>
          </div>

          {/* Session Presence */}
          <div className="pc-session-pill" title="Active live retreat session">
            <span className="pc-session-pill__dot" />
            <span className="pc-session-pill__id">{sessionId}</span>
            <span className="pc-session-pill__sep">•</span>
            <span className="pc-session-pill__count">{totalJoined} joined</span>
          </div>

          {/* User Profile */}
          <div className="pc-profile-badge" title="Jayla Reynolds (VP Communications)">
            <div className="pc-profile-avatar">JR</div>
          </div>
        </div>
      </div>
    </header>
  );
}
