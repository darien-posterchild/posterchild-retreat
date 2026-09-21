import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { useDemoState } from '../../useDemoState';
import { getMission } from '../../config/retreatFlow';

export const ConvergenceNextSteps: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const { state, dispatch } = useDemoState();
  const [resetConfirming, setResetConfirming] = useState(false);

  const completedMissions = state.completedMissionIds || [];

  const handleRestart = () => {
    if (resetConfirming) {
      dispatch({ type: 'RESET' });
      navigate(`/present/${sessionId}`);
    } else {
      setResetConfirming(true);
      setTimeout(() => setResetConfirming(false), 3000);
    }
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  return (
    <ProductPage
      figmaNode="next-steps-closing"
      title="The future of PosterChild"
      description="More capacity. Less friction. More time for the mission."
      secondaryAction={
        <Badge variant="ready" size="md">
          Retreat Consensus Reached
        </Badge>
      }
      primaryAction={
        <Button
          variant="secondary"
          size="md"
          iconLeading="arrow-left"
          onClick={returnHome}
        >
          Return Home [H]
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1080px' }}>
        {/* 1. Dynamic Retreat Outcome Summary */}
        {completedMissions.length > 0 && (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PosterChildIcon name="check" size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#14532D',
                  }}
                >
                  Today’s Retreat Priorities Completed
                </h3>
                <Badge variant="ready" size="sm">
                  {completedMissions.length} Actions
                </Badge>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#166534', fontSize: '14px', lineHeight: 1.6 }}>
                {completedMissions.map((id) => {
                  const mission = getMission(id);
                  return (
                    <li key={id}>
                      <strong>{mission?.label || id}</strong> — {mission?.homeEffect || mission?.description || 'Work moved forward.'}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* 2. Three Conceptual Layers Grid: Explore • Decide • Act */}
        <div className="pc-product-grid-3">
          {/* Layer 1: Explore */}
          <div className="pc-product-card" style={{ gap: '16px', padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#FFF9E8',
                border: '1px solid #FEF08A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PosterChildIcon name="stars-01" size={22} color="#8F6500" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                1. Explore
              </h4>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#525252',
                }}
              >
                PosterChild continuously surfaces community signals, recurring themes in testimonials, and 92%+ aligned funding opportunities without manual digging.
              </p>
            </div>
          </div>

          {/* Layer 2: Decide */}
          <div className="pc-product-card" style={{ gap: '16px', padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D7FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PosterChildIcon name="message-square-quote" size={22} color="#7E22CE" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                2. Decide
              </h4>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#525252',
                }}
              >
                Teams collaborate in real-time alongside Postie to evaluate strategic trade-offs, select optimal channels, and establish immediate consensus.
              </p>
            </div>
          </div>

          {/* Layer 3: Act */}
          <div className="pc-product-card" style={{ gap: '16px', padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PosterChildIcon name="coins-hand" size={22} color="#1D4ED8" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                3. Act
              </h4>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#525252',
                }}
              >
                From social spotlights and full articles to grant application readiness, PosterChild turns organizational context into ready-to-ship assets instantly.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Synthesis Statement Card */}
        <div
          style={{
            backgroundColor: '#FAFAFA',
            border: '1px solid #E5E5E5',
            borderRadius: '14px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--pc-ref-font-display, 'Fraunces')",
              fontSize: '22px',
              fontWeight: 500,
              color: '#171717',
              lineHeight: 1.3,
            }}
          >
            PosterChild helps nonprofit teams understand what matters, decide what to do next, and move the work forward.
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '15px',
              lineHeight: '24px',
              color: '#525252',
            }}
          >
            The product gets smarter because it understands the organization behind the work.
          </p>
        </div>

        {/* 4. Presenter Restart & Actions Region */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #E5E5E5',
          }}
        >
          <Button
            variant="secondary"
            size="md"
            iconLeading="arrow-left"
            onClick={returnHome}
          >
            Return to Home Dashboard
          </Button>

          <Button
            variant={resetConfirming ? 'danger' : 'secondary'}
            size="md"
            iconLeading={resetConfirming ? 'alert-triangle' : 'rotate-ccw'}
            onClick={handleRestart}
          >
            {resetConfirming ? 'Click again to confirm restart' : 'Restart Retreat Session'}
          </Button>
        </div>
      </div>
    </ProductPage>
  );
};

export default ConvergenceNextSteps;
