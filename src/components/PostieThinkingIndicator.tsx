import React from 'react';
import { PostieAnimatedIcon } from './posterchild/PostieAnimatedIcon';

export interface PostieThinkingIndicatorProps {
  label?: string;
  className?: string;
}

export function PostieThinkingIndicator({
  label = 'Thinking...',
  className = ''
}: PostieThinkingIndicatorProps) {
  return (
    <div className={`pc-ref-postie-message-row ${className}`}>
      <div className="pc-ref-postie-msg-wrapper">
        <div className="pc-ref-msg-meta-row">
          <div className="pc-ref-postie-meta-left">
            <PostieAnimatedIcon
              size={20}
              speed="fast"
              isThinking={true}
              interactive={false}
            />
            <span className="pc-ref-postie-author-name">Postie</span>
          </div>
          <span className="pc-ref-typing-status-text">{label}</span>
        </div>
        <div className="pc-ref-typing-dots-bubble">
          <span className="pc-ref-dot-pulse pc-ref-dot-pulse--1" />
          <span className="pc-ref-dot-pulse pc-ref-dot-pulse--2" />
          <span className="pc-ref-dot-pulse pc-ref-dot-pulse--3" />
        </div>
      </div>
    </div>
  );
}
