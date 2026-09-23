import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Logo from './Logo';
import { NavItem, NavSubItem, NavGroup } from './posterchild/NavItem';
import { PosterChildIcon } from './posterchild/Icon';
import { useSidebar } from '../context/SidebarContext';
import avatarDarien from '../assets/screens/home/avatar-darien.png';

import {
  PRODUCT_NAVIGATION,
  buildProductUrl,
  isNavChildActive,
  normalizeProductPath,
} from '../navigation/productNavigation';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showTrialPromo?: boolean;
}

export default function Sidebar({
  onTabChange,
  showTrialPromo = false,
}: SidebarProps) {
  const { isCollapsed, setCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const currentSubPath = normalizeProductPath(location.pathname);

  // Determine which parent section is active
  const activeParentId =
    currentSubPath === 'tell' || currentSubPath.startsWith('tell/')
      ? 'tell'
      : currentSubPath === 'raise' || currentSubPath.startsWith('raise/')
        ? 'raise'
        : currentSubPath === 'manage' || currentSubPath.startsWith('manage/')
          ? 'manage'
          : 'home';

  // Expansion state for parents with children
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pc_sidebar_expanded_parents');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }

    return { tell: true };
  });

  // Ensure active parent is expanded when navigating into its children
  useEffect(() => {
    if (activeParentId && !expandedParents[activeParentId]) {
      setExpandedParents((prev) => {
        const next = { ...prev, [activeParentId]: true };

        try {
          localStorage.setItem(
            'pc_sidebar_expanded_parents',
            JSON.stringify(next)
          );
        } catch {
          // Ignore
        }

        return next;
      });
    }
  }, [activeParentId]);

  const toggleParentExpansion = (
    parentId: string,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setExpandedParents((prev) => {
      const next = {
        ...prev,
        [parentId]: !prev[parentId],
      };

      try {
        localStorage.setItem(
          'pc_sidebar_expanded_parents',
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }

      return next;
    });
  };

  const handleNavigate = (subPath: string, parentId?: string) => {
    const url = buildProductUrl(sessionId, subPath);

    navigate(url);

    if (parentId && onTabChange) {
      onTabChange(parentId);
    }
  };

  const handleToggleKey = (
    e: React.KeyboardEvent,
    targetCollapsed: boolean
  ) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();

      setCollapsed(targetCollapsed);
    }
  };

  return (
    <aside
      className={`pc-ref-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}
      aria-label="Sidebar Navigation"
    >
      <div className="pc-ref-sidebar__card">
        {/* Top Header */}
        <div className="pc-ref-sidebar__header">
          {isCollapsed ? (
            /* Collapsed Header: 36x36 hover-to-open toggle button */
            <div className="pc-ref-sidebar__toggle-wrap group">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                onKeyDown={(e) => handleToggleKey(e, false)}
                className="pc-ref-sidebar__expand-btn"
                title="Open sidebar"
                aria-label="Open sidebar"
              >
                {/* Default state: PosterChild logomark 22px */}
                <div className="pc-ref-sidebar__expand-icon pc-ref-sidebar__expand-icon--logo">
                  <Logo compact size="sm" />
                </div>

                {/* Hover/Focus state: layout-left reopen icon 18px */}
                <div className="pc-ref-sidebar__expand-icon pc-ref-sidebar__expand-icon--reopen">
                  <PosterChildIcon
                    name="layout-left"
                    size={18}
                    color="#404040"
                    strokeWidth={1.8}
                  />
                </div>
              </button>

              <div role="tooltip" className="pc-ref-collapsed-tooltip">
                Open sidebar
              </div>
            </div>
          ) : (
            /* Expanded Header: Full Logo Lockup + Collapse Button */
            <>
              <div
                className="pc-ref-sidebar__logo-wrap cursor-pointer"
                onClick={() => handleNavigate('', 'home')}
              >
                <Logo size="sm" />
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                onKeyDown={(e) => handleToggleKey(e, true)}
                className="pc-ref-sidebar__toggle-btn"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PosterChildIcon
                  name="layout-left"
                  size={18}
                  color="#737373"
                  strokeWidth={1.8}
                />
              </button>
            </>
          )}
        </div>

        {/* Primary Navigation List */}
        <nav
          className={`pc-ref-sidebar__nav ${isCollapsed ? 'is-collapsed' : ''
            }`}
          aria-label="Main Navigation"
        >
          {PRODUCT_NAVIGATION.map((item) => {
            const isParentActive = activeParentId === item.id;
            const hasChildren = Boolean(
              item.children && item.children.length > 0
            );
            const isExpanded = Boolean(expandedParents[item.id]);

            if (isCollapsed) {
              return (
                <div
                  key={item.id}
                  className="pc-ref-nav-item-wrap group"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigate(item.subPath, item.id)
                    }
                    aria-label={item.label}
                    className={`pc-ref-nav-item-collapsed ${isParentActive ? 'is-active' : ''
                      }`}
                  >
                    <PosterChildIcon
                      name={item.icon}
                      size={20}
                      color={isParentActive ? '#F4B400' : '#737373'}
                      strokeWidth={isParentActive ? 2.2 : 2}
                    />
                  </button>

                  <div
                    role="tooltip"
                    className="pc-ref-collapsed-tooltip"
                  >
                    {item.label}
                  </div>
                </div>
              );
            }

            // Expanded Mode
            const isAnyChildActive = Boolean(
              hasChildren &&
              item.children?.some((child) =>
                isNavChildActive(
                  currentSubPath,
                  item.subPath,
                  child.subPath,
                  child.id
                )
              )
            );

            const isParentDirectlyActive =
              currentSubPath === item.subPath ||
              currentSubPath === `${item.subPath}/overview`;

            return (
              <NavGroup key={item.id}>
                <NavItem
                  label={item.label}
                  icon={item.icon}
                  active={
                    isParentDirectlyActive ||
                    (isParentActive && !isExpanded)
                  }
                  childActive={isAnyChildActive}
                  expandable={hasChildren}
                  expanded={isExpanded}
                  onToggleExpand={(e) =>
                    toggleParentExpansion(item.id, e)
                  }
                  onClick={() => {
                    if (hasChildren) {
                      if (isParentActive) {
                        toggleParentExpansion(item.id);
                      } else {
                        setExpandedParents((prev) => {
                          const next = {
                            ...prev,
                            [item.id]: true,
                          };

                          try {
                            localStorage.setItem(
                              'pc_sidebar_expanded_parents',
                              JSON.stringify(next)
                            );
                          } catch {
                            // Ignore
                          }

                          return next;
                        });

                        handleNavigate(item.subPath, item.id);
                      }
                    } else {
                      handleNavigate(item.subPath, item.id);
                    }
                  }}
                />

                {/* Render Hierarchical Submenu Children */}
                {hasChildren && isExpanded && (
                  <div className="pc-ref-nav-sub-list">
                    {item.children!.map((child) => {
                      const isChildActive = isNavChildActive(
                        currentSubPath,
                        item.subPath,
                        child.subPath,
                        child.id
                      );

                      const childIcon =
                        child.icon || 'bar-chart-square-02';

                      return (
                        <NavSubItem
                          key={child.id}
                          label={child.label}
                          icon={childIcon}
                          active={isChildActive}
                          onClick={() =>
                            handleNavigate(
                              child.subPath,
                              item.id
                            )
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </NavGroup>
            );
          })}
        </nav>

        <div className="pc-ref-sidebar__spacer" />

        {/* Footer: Support, Settings, Free trial, and Account Area */}
        <div
          className={`pc-ref-sidebar__footer ${isCollapsed ? 'is-collapsed' : ''
            }`}
        >
          {/* Secondary Nav */}
          <div
            className={`pc-ref-secondary-nav ${isCollapsed ? 'is-collapsed' : ''
              }`}
          >
            {isCollapsed ? (
              <>
                <div className="pc-ref-nav-item-wrap group">
                  <button
                    type="button"
                    className="pc-ref-nav-item-collapsed"
                    aria-label="Support"
                  >
                    <PosterChildIcon
                      name="life-buoy-01"
                      size={20}
                      color="#737373"
                      strokeWidth={1.8}
                    />
                  </button>

                  <div
                    role="tooltip"
                    className="pc-ref-collapsed-tooltip"
                  >
                    Support
                  </div>
                </div>

                <div className="pc-ref-nav-item-wrap group">
                  <button
                    type="button"
                    className="pc-ref-nav-item-collapsed"
                    aria-label="Settings"
                  >
                    <PosterChildIcon
                      name="settings-01"
                      size={20}
                      color="#737373"
                      strokeWidth={1.8}
                    />
                  </button>

                  <div
                    role="tooltip"
                    className="pc-ref-collapsed-tooltip"
                  >
                    Settings
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="pc-ref-secondary-item"
                >
                  <span className="pc-ref-nav-item__icon-box">
                    <PosterChildIcon
                      name="life-buoy-01"
                      size={20}
                      color="#A3A3A3"
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="pc-ref-nav-item__text">
                    Support
                  </span>

                  <span className="pc-ref-nav-item__trailing-icon">
                    <PosterChildIcon
                      name="share-04"
                      size={14}
                      color="#A3A3A3"
                      strokeWidth={1.8}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  className="pc-ref-secondary-item"
                >
                  <span className="pc-ref-nav-item__icon-box">
                    <PosterChildIcon
                      name="settings-01"
                      size={20}
                      color="#A3A3A3"
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="pc-ref-nav-item__text">
                    Settings
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Free Trial Widget */}
          {!isCollapsed && showTrialPromo && (
            <div className="pc-ref-sidebar__trial-card">
              <div className="pc-ref-trial-header">
                <span className="pc-ref-trial-title">
                  Free trial
                </span>

                <span className="pc-ref-trial-days">
                  24 days left
                </span>
              </div>

              <div className="pc-ref-trial-progress">
                <div
                  className="pc-ref-trial-progress-bar"
                  style={{ width: '40%' }}
                />
              </div>

              <button
                type="button"
                className="pc-ref-trial-btn"
              >
                Upgrade now
              </button>
            </div>
          )}

          {/* Account Area */}
          {isCollapsed ? (
            /* Collapsed: Avatar affordance only with tooltip */
            <div className="pc-ref-nav-item-wrap group">
              <div
                className="pc-ref-account-avatar-wrap pc-ref-account-avatar-wrap--collapsed"
                tabIndex={0}
                role="button"
                aria-label="Darien Menendez"
              >
                <img
                  src={avatarDarien}
                  alt="Darien Menendez"
                  className="pc-ref-account-avatar-img"
                />

                <span
                  className="pc-ref-account-status-dot"
                  title="Online"
                />
              </div>

              <div
                role="tooltip"
                className="pc-ref-collapsed-tooltip"
              >
                Darien Menendez
              </div>
            </div>
          ) : (
            /* Expanded: Full Nav Account Card */
            <div className="pc-ref-account-card">
              <div className="pc-ref-account-avatar-wrap">
                <img
                  src={avatarDarien}
                  alt="Darien Menendez"
                  className="pc-ref-account-avatar-img"
                />

                <span
                  className="pc-ref-account-status-dot"
                  title="Online"
                />
              </div>

              <div className="pc-ref-account-info">
                <span className="pc-ref-account-name">
                  Darien Menendez
                </span>

                <span className="pc-ref-account-email">
                  darien@poeterchild.ai
                </span>
              </div>

              <button
                type="button"
                className="pc-ref-account-action"
                title="Account options"
                aria-label="Account options"
              >
                <PosterChildIcon
                  name="chevron-selector-vertical"
                  size={16}
                  color="#A3A3A3"
                  strokeWidth={1.8}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}