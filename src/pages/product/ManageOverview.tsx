import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ManageCategoryCard, ManageInventoryItem } from '../../components/posterchild/ManageCategoryCard';
import { FeaturedIconVariant } from '../../components/posterchild/FeaturedIcon';
import { PosterChildIconName } from '../../components/posterchild/Icon';
import { buildProductUrl } from '../../navigation/productNavigation';

interface ManageCategoryConfig {
  id: string;
  title: string;
  description: string;
  icon: PosterChildIconName;
  tone: FeaturedIconVariant;
  items: ManageInventoryItem[];
  actionLabel: string;
  subPath?: string;
}

const MANAGE_CATEGORIES: ManageCategoryConfig[] = [
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Stories, testimonials, reports and more.',
    icon: 'folder',
    tone: 'brand',
    items: [
      { label: 'Stories', value: 48 },
      { label: 'Testimonials', value: 127 },
      { label: 'Reports', value: 12 },
      { label: 'Program descriptions', value: 36 },
      { label: 'Case studies', value: 18 },
    ],
    actionLabel: 'View knowledge',
  },
  {
    id: 'assets',
    title: 'Assets',
    description: 'Photos, videos, and brand materials you can use and reuse.',
    icon: 'file-06',
    tone: 'success',
    subPath: 'manage/assets',
    items: [
      { label: 'Photos', value: 342 },
      { label: 'Videos', value: 28 },
      { label: 'Brand assets', value: 15 },
      { label: 'Templates', value: 9 },
    ],
    actionLabel: 'View assets',
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Your programs, impact, and brand identity.',
    icon: 'home-line',
    tone: 'purple',
    items: [
      { label: 'Programs', value: 6 },
      { label: 'Impact metrics', value: 12 },
      { label: 'Brand voice & messaging', value: 1 },
      { label: 'About our organization', value: 1 },
      { label: 'Key information', value: 8 },
    ],
    actionLabel: 'View organization',
  },
  {
    id: 'people',
    title: 'People',
    description: 'Your team, donors, funders, partners and contacts.',
    icon: 'users-02',
    tone: 'blue',
    items: [
      { label: 'Team members', value: 24 },
      { label: 'Donors', value: 156 },
      { label: 'Funders', value: 32 },
      { label: 'Partners', value: 18 },
      { label: 'Board members', value: 12 },
    ],
    actionLabel: 'View people',
  },
  {
    id: 'connections',
    title: 'Connections',
    description: 'Integrations and external sources that power your organization.',
    icon: 'settings-04',
    tone: 'pink',
    items: [
      { label: 'Google Drive', value: 'Connected', status: 'connected' },
      { label: 'Google Calendar', value: 'Connected', status: 'connected' },
      { label: 'Social accounts', value: 'Connected', status: 'connected' },
      { label: 'Data sources', value: 'Not connected' },
    ],
    actionLabel: 'Manage connections',
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Permissions, data health and platform settings for your team.',
    icon: 'settings-01',
    tone: 'admin',
    items: [
      { label: 'Team permissions', value: 'Manage', status: 'action' },
      { label: 'Data health', value: 'Healthy', status: 'connected' },
      { label: 'Activity log', value: 'View', status: 'action' },
      { label: 'System settings', value: 'Manage', status: 'action' },
    ],
    actionLabel: 'Go to admin',
  },
];

export default function ManageOverview() {
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const handleCardNavigate = (subPath?: string) => {
    if (subPath) {
      navigate(buildProductUrl(sessionId, subPath));
    }
  };

  return (
    <div className="pc-manage-page" data-figma-node="512:6840">
      {/* Manage Header (Fraunces 36px/44px, DM Sans 16px/24px, gap 2px) */}
      <header className="pc-manage-header">
        <h1 className="pc-manage-title">Your organization, all in one place.</h1>
        <p className="pc-manage-description">
          Everything PosterChild knows about your organization. Keep your information up to date, organized, and ready to use.
        </p>
      </header>

      {/* Manage 6-card Grid (24px gap, 3 columns x 2 rows) */}
      <div className="pc-manage-grid" data-figma-node="512:6890">
        {MANAGE_CATEGORIES.map((cat) => (
          <ManageCategoryCard
            key={cat.id}
            id={cat.id}
            title={cat.title}
            description={cat.description}
            icon={cat.icon}
            tone={cat.tone}
            items={cat.items}
            actionLabel={cat.actionLabel}
            onAction={() => handleCardNavigate(cat.subPath)}
            onClick={() => handleCardNavigate(cat.subPath)}
          />
        ))}
      </div>
    </div>
  );
}
