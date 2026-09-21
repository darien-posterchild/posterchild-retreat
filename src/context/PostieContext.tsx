import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PostieView = 'sidebar' | 'floating' | 'collapsed';

interface PostieContextValue {
  postieView: PostieView;
  setPostieView: (view: PostieView) => void;
  lastOpenPostieView: 'sidebar' | 'floating';
  collapsePostie: () => void;
  openPostie: () => void;
}

const STORAGE_KEY = 'postie_view';
const LAST_OPEN_KEY = 'postie_last_open';

const PostieContext = createContext<PostieContextValue | undefined>(undefined);

export function PostieProvider({ children }: { children: ReactNode }) {
  const [postieView, setPostieViewState] = useState<PostieView>('sidebar');
  const [lastOpenPostieView, setLastOpenPostieViewState] = useState<'sidebar' | 'floating'>('sidebar');

  useEffect(() => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEY) as PostieView | null;
      const savedLastOpen = localStorage.getItem(LAST_OPEN_KEY) as ('sidebar' | 'floating') | null;
      if (savedView && ['sidebar', 'floating', 'collapsed'].includes(savedView)) {
        setPostieViewState(savedView);
      }
      if (savedLastOpen && ['sidebar', 'floating'].includes(savedLastOpen)) {
        setLastOpenPostieViewState(savedLastOpen);
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, []);

  const setPostieView = (view: PostieView) => {
    setPostieViewState(view);
    if (view !== 'collapsed') {
      setLastOpenPostieViewState(view);
      try {
        localStorage.setItem(LAST_OPEN_KEY, view);
      } catch {
        // Ignore
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, view);
      window.dispatchEvent(new Event('posterchild-postie-toggle'));
    } catch {
      // Ignore
    }
  };

  const collapsePostie = () => {
    if (postieView !== 'collapsed') {
      setLastOpenPostieViewState(postieView);
      setPostieViewState('collapsed');
      try {
        localStorage.setItem(LAST_OPEN_KEY, postieView);
        localStorage.setItem(STORAGE_KEY, 'collapsed');
        window.dispatchEvent(new Event('posterchild-postie-toggle'));
      } catch {
        // Ignore
      }
    }
  };

  const openPostie = () => {
    setPostieViewState(lastOpenPostieView);
    try {
      localStorage.setItem(STORAGE_KEY, lastOpenPostieView);
      window.dispatchEvent(new Event('posterchild-postie-toggle'));
    } catch {
      // Ignore
    }
  };

  return (
    <PostieContext.Provider
      value={{
        postieView,
        setPostieView,
        lastOpenPostieView,
        collapsePostie,
        openPostie,
      }}
    >
      {children}
    </PostieContext.Provider>
  );
}

export function usePostie(): PostieContextValue {
  const context = useContext(PostieContext);
  if (!context) {
    throw new Error('usePostie must be used within a PostieProvider');
  }
  return context;
}
