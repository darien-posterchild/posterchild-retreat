import React from 'react';
import { Search, HelpCircle, Settings, Bell, Users } from 'lucide-react';

interface TopHeaderProps {
  sessionId?: string;
  participantCount?: number;
}

export default function TopHeader({ sessionId = 'PC26', participantCount = 0 }: TopHeaderProps) {
  return (
    <header className="pc-app-header">
      <div className="pc-app-header__search-wrap">
        <div className="pc-app-header__search">
          <Search size={15} className="pc-search-icon" />
          <input
            type="text"
            className="pc-search-input"
            placeholder="Search stories, campaigns, quotes..."
            readOnly
          />
          <kbd className="pc-kbd-badge">⌘K</kbd>
        </div>
      </div>

      <div className="pc-app-header__actions">
        {/* Live Retreat Session Presence Tag */}
        <div className="pc-header-session-tag" title="Active Retreat Session">
          <span className="pc-session-live-dot" />
          <span className="pc-session-id">{sessionId}</span>
          <span className="pc-session-sep">•</span>
          <Users size={12} className="pc-session-users-icon" />
          <span className="pc-session-count">{participantCount} joined</span>
        </div>

        <div className="pc-header-icon-group">
          <button type="button" className="pc-header-icon-btn" title="Help">
            <HelpCircle size={17} strokeWidth={1.8} />
          </button>
          <button type="button" className="pc-header-icon-btn" title="Settings">
            <Settings size={17} strokeWidth={1.8} />
          </button>
          <button type="button" className="pc-header-icon-btn pc-header-icon-btn--notify" title="Notifications">
            <Bell size={17} strokeWidth={1.8} />
            <span className="pc-notify-dot">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}
