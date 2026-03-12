import { useState } from 'react';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';

/**
 * ScreenshotButton - Component to capture a DOM element and download as PNG
 *
 * @param {Object} props
 * @param {string|HTMLElement} props.target - Target element ref or selector to capture
 * @param {string} props.filename - Filename for the downloaded image (without extension)
 * @param {Object} props.style - Optional custom styles for the button
 */
export default function ScreenshotButton({ target, filename = 'reading', style }) {
  const { t } = useTranslation();
  const [capturing, setCapturing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCapture = async () => {
    if (!target) return;

    setCapturing(true);
    setSuccess(false);

    try {
      let element;

      // Handle string selector or HTMLElement
      if (typeof target === 'string') {
        element = document.querySelector(target);
      } else if (target.current) {
        element = target.current;
      } else if (target instanceof HTMLElement) {
        element = target;
      }

      if (!element) {
        console.error('Target element not found');
        setCapturing(false);
        return;
      }

      // Add a temporary class for screenshot styling
      element.classList.add('screenshot-mode');

      // Wait a bit for any styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate PNG with better quality
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#150f05',
        cacheBust: true,
        skipFonts: false,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      // Remove the temporary class
      element.classList.remove('screenshot-mode');

      // Download the image
      const link = document.createElement('a');
      link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error('Screenshot failed:', error);
    } finally {
      setCapturing(false);
    }
  };

  const defaultStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    background: success ? 'rgba(200,168,75,0.18)' : capturing ? 'rgba(200,168,75,0.07)' : 'rgba(200,168,75,0.07)',
    border: success ? '1px solid rgba(200,168,75,0.6)' : '1px solid rgba(200,168,75,0.3)',
    color: success ? '#f5e09a' : '#d4b86a',
    padding: '11px 24px',
    fontSize: '13px',
    letterSpacing: '3px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    ...style
  };

  return (
    <button
      onClick={handleCapture}
      disabled={capturing}
      style={defaultStyle}
      className="screenshot-btn"
    >
      <span style={{ fontSize: '15px' }}>{success ? '✓' : capturing ? '⋯' : '📷'}</span>
      <span style={{ minWidth: '80px' }}>
        {capturing ? t('screenshot.capturing') : success ? t('screenshot.captured') : t('screenshot.button')}
      </span>
    </button>
  );
}
