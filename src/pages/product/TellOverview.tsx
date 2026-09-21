import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import AttentionTable from '../../components/AttentionTable';
import { Scene } from '../../types/session';

interface WorkspaceContext {
  scene: Scene;
  votes: Record<string, number>;
  totalVotes: number;
  winner: string | null;
}

export default function TellOverview() {
  const context = useOutletContext<WorkspaceContext>() || {
    scene: 'dashboard',
    votes: {},
    totalVotes: 0,
    winner: null,
  };

  return (
    <ProductPage
      figmaNode="tell-overview"
      title="Tell powerful stories."
      description="Turn your community’s experiences into stories that move people."
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Create story
        </Button>
      }
    >
      {/* 1. PosterChild Noticed */}
      <section className="pc-ref-noticed-section" aria-label="PosterChild notice">
        <h2 className="pc-ref-section-title">PosterChild noticed</h2>
        <div className="pc-ref-noticed-card">
          <svg
            className="pc-ref-noticed-graphic"
            viewBox="0 0 280 137"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tell-noticed-wave-1" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#F4B400" stopOpacity="0" />
                <stop offset="60%" stopColor="#F4B400" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="tell-noticed-wave-2" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FFCC33" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFCC33" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
              </linearGradient>
              <radialGradient id="tell-noticed-glow" cx="80%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFFDF5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="280" height="137" fill="url(#tell-noticed-glow)" />
            <path
              d="M0 85 C60 55, 120 115, 190 70 C230 45, 260 50, 280 40"
              stroke="url(#tell-noticed-wave-1)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M30 110 C90 85, 150 40, 210 65 C245 80, 265 70, 280 60"
              stroke="url(#tell-noticed-wave-2)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <circle cx="190" cy="70" r="3.5" fill="#F4B400" />
            <circle cx="190" cy="70" r="6.5" stroke="#F4B400" strokeOpacity="0.4" strokeWidth="1" />
            <circle cx="210" cy="65" r="2.5" fill="#D97706" />
            <circle cx="135" cy="55" r="2" fill="#F4B400" fillOpacity="0.6" />
            <circle cx="245" cy="48" r="3" fill="#F59E0B" />
          </svg>

          <div className="pc-ref-noticed-stars">
            <PosterChildIcon name="stars-01" size={24} color="#F4B400" strokeWidth={1.8} />
          </div>
          <div className="pc-ref-noticed-content">
            <h3 className="pc-ref-noticed-headline">
              You haven’t shared a workforce development story in 6 weeks.
            </h3>
            <p className="pc-ref-noticed-desc">
              You’re pursuing 3 funders focused on workforce development, and you have 4 new testimonials from that program.
            </p>
            <button type="button" className="pc-ref-noticed-link">
              <span>See why this matters</span>
              <PosterChildIcon name="arrow-right" size={14} color="#8F6500" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Needs Your Attention Table */}
      <AttentionTable
        scene={context.scene}
        votes={context.votes}
        totalVotes={context.totalVotes}
        winner={context.winner}
      />
    </ProductPage>
  );
}
