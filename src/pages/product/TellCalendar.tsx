import React from 'react';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';

interface CalendarEvent {
  id: string;
  month: string;
  day: string;
  title: string;
  category: string;
  channel: string;
  status: 'ready' | 'upcoming';
  statusLabel: string;
}

const UPCOMING_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    month: 'SEP',
    day: '22',
    title: 'Workforce Story Publication',
    category: 'Newsletter Feature',
    channel: 'Email & LinkedIn',
    status: 'ready',
    statusLabel: 'Ready',
  },
  {
    id: 'ev-2',
    month: 'SEP',
    day: '28',
    title: 'Alumni Testimonial Video Drop',
    category: 'Social Campaign',
    channel: 'Instagram & YouTube',
    status: 'upcoming',
    statusLabel: 'Draft in review',
  },
  {
    id: 'ev-3',
    month: 'OCT',
    day: '05',
    title: 'Donor Impact Quarterly Briefing',
    category: 'Major Donors',
    channel: 'Direct Mail & PDF',
    status: 'upcoming',
    statusLabel: 'Planned',
  },
];

export default function TellCalendar() {
  return (
    <ProductPage
      figmaNode="tell-calendar"
      title="Calendar"
      description="Schedule and track upcoming content, storytelling releases, and campaigns."
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Add event
        </Button>
      }
    >
      <div className="pc-product-table-card">
        <div
          className="pc-product-table-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Upcoming Releases</span>
          <span style={{ fontSize: '12px', fontWeight: 400, textTransform: 'none', color: '#737373' }}>
            September – October 2026
          </span>
        </div>

        <div className="pc-product-table-body">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="pc-product-table-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
              }}
            >
              {/* Date Tile + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF9E8',
                    border: '1px solid #FFE58F',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#8F6500',
                      lineHeight: 1,
                    }}
                  >
                    {event.month}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#171717',
                      lineHeight: 1.1,
                      marginTop: '2px',
                    }}
                  >
                    {event.day}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h4
                    style={{
                      margin: 0,
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#171717',
                    }}
                  >
                    {event.title}
                  </h4>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '13px',
                      color: '#737373',
                    }}
                  >
                    {event.category} · {event.channel}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge variant={event.status} showDot>
                  {event.statusLabel}
                </Badge>
                <PosterChildIcon name="arrow-right" size={16} color="#A3A3A3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProductPage>
  );
}
