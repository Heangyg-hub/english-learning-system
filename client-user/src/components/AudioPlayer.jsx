import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function AudioPlayer({ text, audioUrl, size = 'md' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (e) => {
    e.stopPropagation();

    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 16 : 22;
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isSmall ? '30px' : '40px',
    height: isSmall ? '30px' : '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isPlaying ? '#2563eb' : '#eff6ff',
    color: isPlaying ? '#ffffff' : '#2563eb',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    flexShrink: 0,
  };

  return (
    <>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          preload="none"
        />
      )}
      <button
        type="button"
        style={buttonStyle}
        onClick={handlePlay}
        title={`Listen to pronunciation of "${text}"`}
        aria-label="Play audio"
      >
        <Icon
          icon={isPlaying ? 'lucide:volume-2' : 'lucide:volume-1'}
          width={iconSize}
          style={{ animation: isPlaying ? 'pulse 1s infinite' : 'none' }}
        />
      </button>
    </>
  );
}

