import React from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { useDemoState } from '../../useDemoState';

interface CreateStoryOutletContext {
  scene?: string;
  decisionStatus?: string;
}

export default function CreateStory() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  useOutletContext<CreateStoryOutletContext>() || {};
  const { state, dispatch } = useDemoState();

  const isCompleted = state.completedMissionIds?.includes('create-story-flow');

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'create-story-flow' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const backToTell = () => {
    navigate(`/present/${sessionId}/tell`);
  };

  return (
    <ProductPage
      title="Create a new story"
      description="Start with what PosterChild already knows — or bring in something new."
      primaryAction={
        isCompleted ? (
          <Button variant="primary" size="md" iconLeading="arrow-left" onClick={returnHome}>
            Return to Home
          </Button>
        ) : (
          <Button variant="primary" size="md" iconLeading="check" onClick={completeMission}>
            Complete placeholder mission
          </Button>
        )
      }
      secondaryAction={
        <Badge variant={isCompleted ? 'ready' : 'upcoming'} size="md">
          {isCompleted ? 'Mission Complete' : 'Story Draft Studio • Placeholder'}
        </Badge>
      }
    >
      <div className="create-story-placeholder-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Completion notice */}
        {isCompleted && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF3',
              border: '1px solid #A6F4C5',
              color: '#027A48'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PosterChildIcon name="check" size={18} strokeWidth={2.5} />
              <strong>Story Creation Mission Completed</strong>
              <span>— Story draft recorded in session history.</span>
            </div>
            <Button variant="primary" size="sm" onClick={returnHome}>
              Return to Home [H]
            </Button>
          </div>
        )}

        {/* =========================================================
            FINAL CREATE STORY DESIGN GOES HERE
            The final multi-step story creation wizard / canvas will
            replace the placeholder card below.
           ========================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px dashed #D0D5DD',
            borderRadius: '12px',
            padding: '48px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            minHeight: '320px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '28px',
              backgroundColor: '#F4EBFF',
              color: '#7F56D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PosterChildIcon name="plus" size={28} strokeWidth={2.5} />
          </div>

          <div style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#101828', margin: '0 0 8px 0' }}>
              This story creation experience is coming next.
            </h2>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.5, margin: 0 }}>
              The final workflow will be designed from the current PosterChild story-creation concept.
            </p>
          </div>

          <div
            style={{
              marginTop: '12px',
              padding: '12px 18px',
              borderRadius: '8px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #EAECF0',
              maxWidth: '520px'
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#475467', lineHeight: 1.5 }}>
              💬 <em>Postie: “When you’re ready, we can start from existing stories, testimonials, or a new idea.”</em>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {!isCompleted ? (
              <Button variant="primary" size="md" iconLeading="check" onClick={completeMission}>
                Complete placeholder mission
              </Button>
            ) : (
              <Button variant="primary" size="md" iconLeading="arrow-left" onClick={returnHome}>
                Return to Home [H]
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={backToTell}>
              Explore Stories Catalog
            </Button>
          </div>
        </div>
      </div>
    </ProductPage>
  );
}
