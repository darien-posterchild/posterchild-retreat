import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'posterchild-sidebar-collapsed';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('posterchild-sidebar-toggle', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('posterchild-sidebar-toggle', callback);
  };
};

const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const getServerSnapshot = () => false;

interface SidebarContextType {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const storedCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localCollapsed, setLocalCollapsed] = useState<boolean | null>(null);
  const isCollapsed = localCollapsed !== null ? localCollapsed : storedCollapsed;

  const setCollapsed = (collapsed: boolean) => {
    setLocalCollapsed(collapsed);
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
      window.dispatchEvent(new Event('posterchild-sidebar-toggle'));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, setCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (context) {
    return context;
  }

  // Fallback if used outside SidebarProvider
  const storedCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    isCollapsed: storedCollapsed,
    setCollapsed: (collapsed: boolean) => {
      try {
        localStorage.setItem(STORAGE_KEY, String(collapsed));
        window.dispatchEvent(new Event('posterchild-sidebar-toggle'));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // Ignore
      }
    },
    toggleSidebar: () => {
      try {
        const next = !getSnapshot();
        localStorage.setItem(STORAGE_KEY, String(next));
        window.dispatchEvent(new Event('posterchild-sidebar-toggle'));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // Ignore
      }
    },
  };
}
