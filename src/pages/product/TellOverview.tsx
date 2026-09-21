import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { InsightBanner } from '../../components/posterchild/InsightBanner';
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
        <InsightBanner
          title="You haven’t shared a workforce development story in 6 weeks."
          description="You’re pursuing 3 funders focused on workforce development, and you have 4 new testimonials from that program."
          actionLabel="See why this matters"
          onAction={() => {}}
        />
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
