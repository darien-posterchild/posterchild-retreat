import React from 'react';

interface PostieAnimatedIconProps {
  size?: 20 | 28 | 32 | 40;
  className?: string;
  speed?: 'slow' | 'ambient' | 'normal' | 'fast';
  interactive?: boolean;
  isThinking?: boolean;
  glow?: boolean;
  alt?: string;
  onClick?: () => void;
}

export function PostieAnimatedIcon({
  size = 40,
  className = '',
  speed = 'ambient',
  interactive = true,
  isThinking = false,
  glow = false,
  alt = 'Postie AI',
  onClick,
}: PostieAnimatedIconProps) {
  const durationClass = isThinking
    ? 'postie-spin-fast'
    : speed === 'slow'
    ? 'postie-spin-slow'
    : speed === 'fast'
    ? 'postie-spin-fast'
    : speed === 'normal'
    ? 'postie-spin-normal'
    : 'postie-spin-ambient';

  const isSmall = size <= 24;
  const borderRadius = isSmall ? '4.28px' : '8.57px';

  return (
    <div
      role="img"
      aria-label={alt}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
      className={`postie-animated-container ${interactive ? 'is-interactive' : ''} ${glow ? 'postie-glow-pulse' : ''} ${className}`}
    >
      {/* Centered, perfectly on-axis rotating layer (rotates around 50% 50%) */}
      <div
        style={{
          transformOrigin: '50% 50%',
          width: '100%',
          height: '100%',
        }}
        className={`postie-rotate-element ${durationClass} ${interactive ? 'postie-spin-interactive' : ''}`}
      >
        {isSmall ? (
          /* 20x20 ViewBox with Logo mathematically centered at (10.0, 10.0) */
          <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="postieGoldGrad20" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD84D" />
                <stop offset="50%" stopColor="#FFC700" />
                <stop offset="100%" stopColor="#F4B400" />
              </linearGradient>
            </defs>
            <g transform="translate(-0.0759, -0.0759)">
              <path
                id="PosterChild_Logo_20"
                d="M3.4716 9.19565C3.4716 9.07409 3.57039 8.97478 3.69188 8.97813C5.0616 9.01654 6.34195 9.41273 7.44286 10.0761C8.52067 10.7255 9.42637 11.6313 10.0759 12.7091C10.7392 13.81 11.1354 15.0904 11.1738 16.4601C11.1772 16.5816 11.0779 16.6803 10.9563 16.6803H9.19543C9.074 16.6802 8.97583 16.5814 8.97101 16.4601C8.85825 13.5956 6.5563 11.2937 3.69188 11.1809C3.57054 11.176 3.47164 11.078 3.4716 10.9565V9.19565ZM8.97791 3.69209C8.97451 3.57055 9.07384 3.47181 9.19543 3.47181H10.9563C11.0779 3.47181 11.1759 3.5706 11.1807 3.69209C11.2935 6.55647 13.5955 8.85839 16.4599 8.97122C16.5813 8.97601 16.6801 9.07406 16.6801 9.19565V10.9565C16.6801 11.0781 16.5814 11.1774 16.4599 11.174C15.0902 11.1356 13.8097 10.7394 12.7089 10.0761L12.6847 10.0616C11.6176 9.41316 10.7205 8.51278 10.0759 7.44307C9.41254 6.3422 9.01636 5.06175 8.97791 3.69209ZM10.9149 11.569C11.3783 11.0467 11.9118 10.5881 12.5003 10.2073C13.2305 10.6614 14.0402 10.9998 14.9034 11.1975C15.0222 11.2247 15.0305 11.4269 14.9151 11.4661C13.9707 11.7857 13.1406 12.3551 12.5045 13.0951C12.4183 13.1949 12.2649 13.2049 12.1716 13.1117L10.9252 11.8653C10.8445 11.7844 10.839 11.6545 10.9149 11.569ZM5.23729 8.68534C6.18641 8.36409 7.01958 7.79142 7.65692 7.04601C7.74282 6.94555 7.89687 6.93548 7.99045 7.02875L9.23756 8.27586C9.3179 8.35652 9.32324 8.48531 9.24791 8.57071C8.78194 9.09806 8.24524 9.5618 7.65209 9.94557C6.92183 9.4914 6.11164 9.15237 5.24834 8.95465C5.12978 8.92713 5.12188 8.7244 5.23729 8.68534Z"
                fill="url(#postieGoldGrad20)"
              />
            </g>
          </svg>
        ) : (
          /* 40x40 ViewBox with Logo mathematically centered at (20.0, 20.0) */
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="postieGoldGrad40" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD84D" />
                <stop offset="45%" stopColor="#FFC700" />
                <stop offset="100%" stopColor="#F4B400" />
              </linearGradient>
            </defs>
            <g transform="translate(-0.1522, -0.1518)">
              <path
                id="PosterChild_Logo_40"
                d="M6.94388 18.3904C6.94389 18.1473 7.14078 17.9494 7.38375 17.9561C10.1232 18.0329 12.6846 18.8246 14.8864 20.1513C17.0421 21.4503 18.8541 23.2622 20.1531 25.418C21.4798 27.6198 22.2708 30.1806 22.3476 32.9199C22.3544 33.163 22.1571 33.3605 21.914 33.3605H18.3909C18.148 33.3602 17.9517 33.1627 17.942 32.9199C17.7165 27.1911 13.1126 22.5872 7.38375 22.3617C7.14108 22.3518 6.94328 22.1557 6.94319 21.9128L6.94388 18.3904ZM17.9558 7.38399C17.949 7.14091 18.1477 6.94343 18.3909 6.94343H21.9126C22.1557 6.94343 22.3518 7.14107 22.3614 7.38399C22.587 13.1127 27.191 17.7166 32.9197 17.9423C33.1626 17.9518 33.3602 18.148 33.3603 18.3911L33.361 21.9135C33.3609 22.1567 33.1628 22.3547 32.9197 22.3479C30.1805 22.2709 27.6201 21.4793 25.4184 20.1527L25.3908 20.1361L25.3694 20.123C23.2351 18.8261 21.4409 17.0254 20.1517 14.886C18.8251 12.6842 18.0327 10.1234 17.9558 7.38399ZM21.8297 23.1378C22.7568 22.093 23.824 21.1754 25.0013 20.4137C26.4617 21.3218 28.0805 21.9994 29.8068 22.3948C30.0445 22.4493 30.0612 22.8538 29.8303 22.9321C27.9414 23.5713 26.2826 24.71 25.0103 26.19C24.8382 26.3901 24.5307 26.409 24.344 26.2224L21.8511 23.7296C21.6895 23.568 21.678 23.3088 21.8297 23.1378ZM10.4974 17.9098C10.2597 17.8554 10.2432 17.4496 10.4739 17.3712C12.3723 16.7287 14.039 15.5828 15.3138 14.0918C15.4858 13.8907 15.7945 13.8709 15.9816 14.058L18.4744 16.5508C18.6357 16.7121 18.6475 16.9709 18.4965 17.1419C17.5645 18.1967 16.4899 19.1227 15.3035 19.8903C13.8431 18.982 12.2239 18.3052 10.4974 17.9098Z"
                fill="url(#postieGoldGrad40)"
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}

export default PostieAnimatedIcon;
