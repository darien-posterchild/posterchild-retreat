import React from 'react';
import { Badge } from './Badge';
import { PosterChildIcon } from './Icon';
import youthStoryImage from '../../assets/screens/home/elena-mentorship.png';

export interface SuggestedStoryCardProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeLabel?: string;
  tags?: string[];
  onViewAll?: () => void;
  onCardClick?: () => void;
  className?: string;
}

export const SuggestedStoryCard: React.FC<SuggestedStoryCardProps> = ({
  sectionTitle = "Suggested for you",
  sectionSubtitle = "Based on your work, here’s a story we’ve already drafted.",
  title = "What happens when young people see a future for themselves?",
  description = "PosterChild pulled together a first draft using 4 recent testimonials from your Youth Career Pathways program. It highlights themes of belonging, confidence, and career opportunity.",
  imageSrc = youthStoryImage,
  imageAlt = "Youth Career Pathways story preview",
  badgeLabel = "Draft Story",
  tags = ["Youth Career Pathway", "Workforce Development", "4 testimonials"],
  onViewAll,
  onCardClick,
  className = ""
}) => {
  return (
    <section className={`pc-ref-suggested-section ${className}`.trim()} aria-label="Suggested for you">
      <div className="pc-ref-suggested-header">
        <div className="pc-ref-suggested-title-wrap">
          <h2 className="pc-ref-section-title">{sectionTitle}</h2>
          <p className="pc-ref-section-subtitle">
            {sectionSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="pc-ref-view-all-link"
          aria-label="View all suggested stories"
        >
          <span>View all</span>
          <PosterChildIcon name="arrow-right" size={14} color="#8F6500" strokeWidth={2} />
        </button>
      </div>

      <div
        className="pc-ref-suggested-card"
        onClick={onCardClick}
        role={onCardClick ? 'button' : undefined}
        tabIndex={onCardClick ? 0 : undefined}
      >
        <div className="pc-ref-suggested-image-wrap">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="pc-ref-suggested-image"
          />
        </div>

        <div className="pc-ref-suggested-details">
          <div className="pc-ref-suggested-top-meta">
            <span className="pc-ref-suggested-badge">{badgeLabel}</span>
          </div>

          <div className="pc-ref-suggested-body">
            <h3 className="pc-ref-suggested-title">{title}</h3>
            <p className="pc-ref-suggested-desc">{description}</p>
          </div>

          <div className="pc-ref-suggested-tags">
            {tags.map((tag) => (
              <span key={tag} className="pc-ref-suggested-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuggestedStoryCard;
