import { QRCodeSVG } from 'qrcode.react';

interface Props {
  url?: string;
}

export default function QRPlaceholder({
  url = 'https://posterchild-retreat.web.app/join/PC26'
}: Props) {
  return (
    <div className="qr-container" aria-label={`Scan to join: ${url}`}>
      <QRCodeSVG
        value={url}
        size={240}
        level="H" // High error correction (recovers up to 30% data loss, ensuring instant camera scanability)
        marginSize={1}
        fgColor="#141613"
        bgColor="#FFFFFF"
        className="qr-svg"
      />

      <div className="qr-center-badge">
        <span className="qr-center-badge__mark" />
        <span className="qr-center-badge__text">PC</span>
      </div>
    </div>
  );
}