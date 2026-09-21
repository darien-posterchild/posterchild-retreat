// Centralized PosterChild Design System Component Registry

export * from './Icon';
export { PosterChildIcon, default as Icon } from './Icon';

export * from './Button';
export { Button } from './Button';

export * from './Badge';
export { Badge } from './Badge';

export * from './FeaturedIcon';
export { FeaturedIcon } from './FeaturedIcon';

export * from './NavItem';
export { NavItem } from './NavItem';

export * from './PostieAnimatedIcon';
export { PostieAnimatedIcon } from './PostieAnimatedIcon';

export * from './MetricCard';
export { MetricCard, default as MetricCardDefault } from './MetricCard';

export * from './ProductPage';
export { ProductPage, default as ProductPageDefault } from './ProductPage';

export * from './ManageCategoryCard';
export { ManageCategoryCard, default as ManageCategoryCardDefault } from './ManageCategoryCard';

export * from './SuggestedStoryCard';
export { SuggestedStoryCard, default as SuggestedStoryCardDefault } from './SuggestedStoryCard';

// Re-export shared application components
export { default as Sidebar } from '../Sidebar';
export { default as AttentionTable } from '../AttentionTable';
export { default as PostiePanel } from '../PostiePanel';
export { default as ActionCard } from '../ActionCard';
export { default as Logo } from '../Logo';
export { SidebarProvider, useSidebar } from '../../context/SidebarContext';
export { PostieProvider, usePostie } from '../../context/PostieContext';
