import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { buildProductUrl } from '../../navigation/productNavigation';

type AssetType = 'All' | 'Photo' | 'Video' | 'Brand asset' | 'Template';

interface AssetData {
  id: string;
  type: 'Photo' | 'Video' | 'Brand asset' | 'Template';
  title: string;
  size: string;
  tagsCount: string;
  fileExtension: string;
  usedIn: string;
  date: string;
}

const ASSETS_DATA: AssetData[] = [
  {
    id: 'asset-1',
    type: 'Photo',
    title: 'Youth Career Pathways workshop',
    size: '6.52 MB',
    tagsCount: '3 tags',
    fileExtension: 'JPG',
    usedIn: 'Story',
    date: 'Sep 8, 2026',
  },
  {
    id: 'asset-2',
    type: 'Photo',
    title: 'Community roundtable discussion',
    size: '4.8 MB',
    tagsCount: '2 tags',
    fileExtension: 'JPG',
    usedIn: 'Newsletter',
    date: 'Sep 2, 2026',
  },
  {
    id: 'asset-3',
    type: 'Video',
    title: 'Program recap — Spring cohort celebration',
    size: '640 MB',
    tagsCount: '1 tag',
    fileExtension: 'MP4',
    usedIn: 'Story',
    date: 'Sep 2, 2026',
  },
  {
    id: 'asset-4',
    type: 'Brand asset',
    title: 'Brighter Futures primary logo kit',
    size: '98.73 MB',
    tagsCount: '4 files',
    fileExtension: 'SVG + PNG',
    usedIn: 'Brand settings',
    date: 'Sep 2, 2026',
  },
  {
    id: 'asset-5',
    type: 'Template',
    title: 'Youth Career Pathways social card',
    size: '238 KB',
    tagsCount: '2 tags',
    fileExtension: 'JPG',
    usedIn: 'Social post',
    date: 'Aug 26, 2026',
  },
  {
    id: 'asset-6',
    type: 'Template',
    title: 'Annual impact report cover template',
    size: '325 KB',
    tagsCount: '1 tag',
    fileExtension: 'PDF',
    usedIn: 'Print & Web',
    date: 'Aug 18, 2026',
  },
];

export default function ManageAssets() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const [activeTab, setActiveTab] = useState<AssetType>('All');

  const filteredAssets =
    activeTab === 'All'
      ? ASSETS_DATA
      : ASSETS_DATA.filter((a) => a.type === activeTab);

  return (
    <ProductPage
      figmaNode="manage-assets"
      title="Assets"
      description="Photos, videos, and brand materials you can use and reuse."
      secondaryAction={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(buildProductUrl(sessionId || 'PC26', 'manage'))}
        >
          ← Back to Manage
        </Button>
      }
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Upload asset
        </Button>
      }
    >
      {/* 1. Filter Tabs */}
      <div className="pc-product-filter-tabs">
        {(['All', 'Photo', 'Video', 'Brand asset', 'Template'] as AssetType[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pc-product-filter-tab ${isActive ? 'is-active' : ''}`}
              >
                {tab}
              </button>
            );
          }
        )}
      </div>

      {/* 2. Asset Cards Grid */}
      <div className="pc-product-grid-3">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="pc-product-card"
            style={{ justifyContent: 'space-between', gap: '16px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant="brand">{asset.fileExtension}</Badge>
                <span
                  style={{
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '12px',
                    color: '#737373',
                  }}
                >
                  {asset.size}
                </span>
              </div>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                {asset.title}
              </h4>
              <span
                style={{
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '12px',
                  color: '#737373',
                }}
              >
                {asset.tagsCount} · Used in {asset.usedIn}
              </span>
            </div>

            <div
              style={{
                borderTop: '1px solid #F5F5F5',
                paddingTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '12px',
                color: '#737373',
              }}
            >
              <span>Added {asset.date}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: '#8F6500',
                  cursor: 'pointer',
                }}
              >
                Use in story →
              </span>
            </div>
          </div>
        ))}
      </div>
    </ProductPage>
  );
}
