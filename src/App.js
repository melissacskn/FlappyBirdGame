import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 2;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;

const CHARACTERS = {
  DOG: {
    name: 'Dog',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5) scaleX(-1)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🐕',
    size: 32
  },
  PANDA: {
    name: 'Panda',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🐼',
    size: 32
  },
  FAIRY: {
    name: 'Fairy',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🧚',
    size: 32
  },
  BUTTERFLY: {
    name: 'Butterfly',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🦋',
    size: 32
  },
  GHOST: {
    name: 'Ghost',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '👻',
    size: 32
  },
  NINJA: {
    name: 'Ninja',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🥷',
    size: 32
  },
  ROBOT: {
    name: 'Robot',
    style: {
      width: '32px',
      height: '32px',
      fontSize: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transform: 'scale(1.5)',
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: '🤖',
    size: 32
  }
};

const LANDMARKS = {
  SUNNY: {
    TREE: `<svg viewBox="0 0 32 48" width="100%" height="100%">
      <path d="M14 32h4v16h-4zM8 16h16l-8-16z" fill="currentColor"/>
      <path d="M4 32h24l-12-16z" fill="currentColor"/>
    </svg>`,
    BUSH: `<svg viewBox="0 0 48 32" width="100%" height="100%">
      <path d="M8 16c0-8 8-16 16-16s16 8 16 16z" fill="currentColor"/>
    </svg>`,
    FLOWER: `<svg viewBox="0 0 16 32" width="100%" height="100%">
      <path d="M7 16h2v16H7zM0 8c0-4 8-4 8-0c0-4 8-4 8 0c0 4-8 4-8 8c0-4-8-4-8-8z" fill="currentColor"/>
    </svg>`
  },
  RAINY: {
    PUDDLE: `<svg viewBox="0 0 64 16" width="100%" height="100%">
      <path d="M8 4c16-8 32-8 48 0c-16 8-32 8-48 0z" fill="currentColor"/>
    </svg>`,
    UMBRELLA: `<svg viewBox="0 0 32 48" width="100%" height="100%">
      <path d="M0 24c0-12 16-24 16-24c0 0 16 12 16 24zM14 24h4v16h-4z" fill="currentColor"/>
    </svg>`,
    CLOUD: `<svg viewBox="0 0 64 32" width="100%" height="100%">
      <path d="M8 24c0-8 8-16 16-16c0-8 16-8 24 0c8 0 16 8 16 16z" fill="currentColor"/>
      <path d="M16 28l2-8M32 28l2-8M48 28l2-8" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  FOREST: {
    PINE: `<svg viewBox="0 0 32 64" width="100%" height="100%">
      <path d="M12 48h8v16h-8zM4 48h24l-12-16zM8 32h16l-8-16z" fill="currentColor"/>
    </svg>`,
    BUSH: `<svg viewBox="0 0 48 32" width="100%" height="100%">
      <path d="M0 32c8-16 16-32 24-32c8 0 16 16 24 32z" fill="currentColor"/>
    </svg>`,
    MUSHROOM: `<svg viewBox="0 0 32 32" width="100%" height="100%">
      <path d="M12 16h8v16h-8zM0 16c0-8 8-16 16-16s16 8 16 16z" fill="currentColor"/>
    </svg>`
  },
  NIGHT: {
    MOON: `<svg viewBox="0 0 32 32" width="100%" height="100%">
      <path d="M16 0c16 0 16 32 0 32C0 32 8 0 16 0z" fill="currentColor"/>
    </svg>`,
    STAR: `<svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M8 0l2 6l6 2l-6 2l-2 6l-2-6l-6-2l6-2z" fill="currentColor"/>
    </svg>`,
    OWL: `<svg viewBox="0 0 32 32" width="100%" height="100%">
      <path d="M8 8c0-8 16-8 16 0v16c0 8-16 8-16 0zM12 12a4 4 0 1 0 0-1M20 12a4 4 0 1 0 0-1" fill="currentColor"/>
    </svg>`
  },
  SNOW: {
    SNOWMAN: `<svg viewBox="0 0 32 48" width="100%" height="100%">
      <circle cx="16" cy="12" r="8" fill="currentColor"/>
      <circle cx="16" cy="28" r="12" fill="currentColor"/>
    </svg>`,
    CRYSTAL: `<svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M8 0v16M0 8h16M2 2l12 12M14 2l-12 12" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    PINE: `<svg viewBox="0 0 32 64" width="100%" height="100%">
      <path d="M12 48h8v16h-8zM4 48h24l-12-16zM8 32h16l-8-16z" fill="currentColor" stroke="white"/>
    </svg>`
  }
};

const BACKGROUNDS = {
  SUNNY: {
    name: 'Sunny Day',
    sky: '#87CEEB',
    ground: '#90EE90',
    landmarks: [
      { 
        svg: LANDMARKS.SUNNY.TREE,
        size: '160px',
        bottom: '60px',
        style: { 
          color: '#228B22',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1.2)'
        }
      },
      { 
        svg: LANDMARKS.SUNNY.BUSH,
        size: '100px',
        bottom: '60px',
        style: { 
          color: '#32CD32',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1.1)'
        }
      },
      { 
        svg: LANDMARKS.SUNNY.FLOWER,
        size: '80px',
        bottom: '60px',
        style: { 
          color: '#FF69B4',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1.3)'
        }
      }
    ]
  },
  RAINY: {
    name: 'Rainy Day',
    sky: '#4A5D75',
    ground: '#4D5D53',
    landmarks: [
      { 
        svg: LANDMARKS.RAINY.PUDDLE,
        size: '140px',
        bottom: '60px',
        style: { 
          color: '#7BA7BC',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1.2, 0.8)'
        }
      },
      { 
        svg: LANDMARKS.RAINY.UMBRELLA,
        size: '120px',
        bottom: '60px',
        style: { 
          color: '#FF4444',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1)'
        }
      },
      { 
        svg: LANDMARKS.RAINY.CLOUD,
        size: '160px',
        bottom: '60px',
        style: { 
          color: '#8795A1',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1.1)'
        }
      }
    ]
  },
  FOREST: {
    name: 'Forest',
    sky: '#87CEEB',
    ground: '#90EE90',
    landmarks: [
      { 
        svg: LANDMARKS.FOREST.PINE,
        size: '180px',
        bottom: '60px',
        style: { 
          color: '#228B22',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1)'
        }
      },
      { 
        svg: LANDMARKS.FOREST.PINE,
        size: '160px',
        bottom: '60px',
        style: { 
          color: '#228B22',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(0.9)'
        }
      },
      { 
        svg: LANDMARKS.FOREST.PINE,
        size: '140px',
        bottom: '60px',
        style: { 
          color: '#228B22',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(0.8)'
        }
      }
    ]
  },
  NIGHT: {
    name: 'Night Sky',
    sky: '#191970',
    ground: '#2F4F4F',
    landmarks: [
      { 
        svg: LANDMARKS.NIGHT.MOON,
        size: '120px',
        bottom: '60px',
        style: { 
          color: '#FFF8DC',
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
          transform: 'scale(1.2)'
        }
      },
      { 
        svg: LANDMARKS.NIGHT.STAR,
        size: '80px',
        bottom: '60px',
        style: { 
          color: '#FFD700',
          filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))',
          transform: 'scale(1.1)'
        }
      },
      { 
        svg: LANDMARKS.NIGHT.OWL,
        size: '100px',
        bottom: '60px',
        style: { 
          color: '#8B4513',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
          transform: 'scale(1)'
        }
      }
    ]
  },
  SNOW: {
    name: 'Snowy Day',
    sky: '#B0E0E6',
    ground: '#FFFAFA',
    landmarks: [
      { 
        svg: LANDMARKS.SNOW.SNOWMAN,
        size: '140px',
        bottom: '60px',
        style: { 
          color: '#F0FFFF',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(1)'
        }
      },
      { 
        svg: LANDMARKS.SNOW.CRYSTAL,
        size: '80px',
        bottom: '60px',
        style: { 
          color: '#E0FFFF',
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
          transform: 'scale(1.2) rotate(45deg)'
        }
      },
      { 
        svg: LANDMARKS.SNOW.PINE,
        size: '160px',
        bottom: '60px',
        style: { 
          color: '#2F4F4F',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
          transform: 'scale(0.9)'
        }
      }
    ]
  }
};

const keyframes = `
  @keyframes fall {
    from {
      transform: translateY(-20px);
    }
    to {
      transform: translateY(500px);
    }
  }
`;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS.DOG);
  const [showCharacterSelect, setShowCharacterSelect] = useState(true);
  const [bounce, setBounce] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const characterCount = Object.keys(CHARACTERS).length;
  const radius = 150; // Distance from center of circle

  // Background elements
  const [clouds, setClouds] = useState([
    { x: 100, y: 50 },
    { x: 300, y: 80 },
    { x: 500, y: 30 },
  ]);

  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS.SUNNY);
  const [showBackgroundSelect, setShowBackgroundSelect] = useState(false);
  const backgroundCount = Object.keys(BACKGROUNDS).length;
  const [backgroundAngle, setBackgroundAngle] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      if (!gameStarted) {
        setBounce(prev => -prev);
      }
    }, 500);

    return () => clearInterval(bounceInterval);
  }, [gameStarted]);

  useEffect(() => {
    const cloudInterval = setInterval(() => {
      setClouds(prevClouds => 
        prevClouds.map(cloud => ({
          ...cloud,
          x: cloud.x <= -100 ? 600 : cloud.x - 0.5
        }))
      );
    }, 50);

    return () => clearInterval(cloudInterval);
  }, []);

  useEffect(() => {
    // Add keyframes to document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdVelocity(JUMP_FORCE);
      if (!gameStarted) setGameStarted(true);
    }
  }, [gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') jump();
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setBirdPosition((prev) => {
        const newPosition = prev + birdVelocity;
        if (newPosition > 500 || newPosition < 0) {
          setGameOver(true);
          return prev;
        }
        return newPosition;
      });

      setBirdVelocity((prev) => prev + GRAVITY);

      setPipes((prevPipes) => {
        const newPipes = prevPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < 300) {
          const height = Math.random() * 200 + 100;
          newPipes.push({ x: 500, height });
        }

        return newPipes;
      });

      // Collision detection
      pipes.forEach((pipe) => {
        if (
          pipe.x < 100 + 40 &&
          pipe.x + PIPE_WIDTH > 100 &&
          (birdPosition < pipe.height || birdPosition > pipe.height + PIPE_GAP)
        ) {
          setGameOver(true);
        }
      });

      // Score
      pipes.forEach((pipe) => {
        if (pipe.x === 98) setScore((prev) => prev + 1);
      });
    }, 20);

    if (gameOver) clearInterval(gameLoop);
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdPosition, birdVelocity, pipes]);

  const resetGame = () => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    setShowBackgroundSelect(true);
  };

  const selectBackground = (background) => {
    setSelectedBackground(background);
    setShowBackgroundSelect(false);
    setShowCharacterSelect(false);
    setGameStarted(false);
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-container" style={{ position: 'relative', width: '500px', margin: '0 auto' }}>
      {/* High Score Display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '14px',
        textShadow: '2px 2px 0 #000',
        zIndex: 100
      }}>
        High Score: {highScore}
      </div>

      <div 
        className="game" 
        onClick={jump}
        style={{ 
          height: '500px', 
          width: '500px', 
          backgroundColor: selectedBackground.sky,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '4px solid #4a4a4a',
          borderRadius: '8px'
        }}
      >
        {/* Weather Effects */}
        {selectedBackground.name === 'Night Sky' && (
          <>
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              fontSize: '64px',
              lineHeight: '64px',
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.7))',
              imageRendering: 'pixelated'
            }}>
              🌙
            </div>
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '40px',
              fontSize: '32px',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))'
            }}>⭐</div>
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '140px',
              fontSize: '32px',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))'
            }}>⭐</div>
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '140px',
              fontSize: '32px',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))'
            }}>⭐</div>
          </>
        )}

        {selectedBackground.name === 'Snowy Day' && (
          <>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 500}px`,
                  top: `${Math.random() * 400}px`,
                  fontSize: '24px',
                  animation: `fall ${Math.random() * 8 + 12}s linear infinite`,
                  filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                }}
              >
                ❄️
              </div>
            ))}
          </>
        )}

        {selectedBackground.name === 'Rainy Day' && (
          <>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontSize: '64px',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))'
            }}>
              🌈
            </div>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 500}px`,
                  top: `${Math.random() * 300}px`,
                  fontSize: '20px',
                  animation: `fall ${Math.random() * 4 + 8}s linear infinite`,
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
                }}
              >
                💧
              </div>
            ))}
          </>
        )}

        {(selectedBackground.name === 'Sunny Day' || selectedBackground.name === 'Forest') && (
          <>
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              fontSize: '64px',
              lineHeight: '64px',
              filter: 'drop-shadow(0 0 15px #FFD700)',
              imageRendering: 'pixelated'
            }}>
              ☀️
            </div>
            {clouds.map((cloud, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${cloud.x}px`,
                top: `${cloud.y}px`,
                fontSize: '40px',
                lineHeight: '40px',
                opacity: 0.9,
                imageRendering: 'pixelated',
                filter: 'contrast(1.1)'
              }}>
                ☁️
              </div>
            ))}
            {selectedBackground.name === 'Forest' && (
              <>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '40px', 
                  fontSize: '64px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌴</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '160px', 
                  fontSize: '64px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌳</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '280px', 
                  fontSize: '64px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌴</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '400px', 
                  fontSize: '64px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌳</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '100px', 
                  fontSize: '32px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌹</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '220px', 
                  fontSize: '32px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌻</div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '60px', 
                  left: '340px', 
                  fontSize: '32px',
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)'
                }}>🌹</div>
              </>
            )}
          </>
        )}

        {/* Landmarks */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: 0,
          right: 0,
          height: '120px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end'
        }}>
          {selectedBackground.landmarks.map((landmark, index) => (
            <div
              key={index}
              style={{
                width: landmark.size,
                height: landmark.size,
                ...landmark.style,
                dangerouslySetInnerHTML: { __html: landmark.svg }
              }}
            />
          ))}
        </div>

        {/* Ground */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: selectedBackground.ground,
          borderTop: `4px solid ${selectedBackground.ground}`
        }} />

        {/* Character */}
        <div
          style={{
            position: 'absolute',
            left: '100px',
            top: `${birdPosition}px`,
            width: `${selectedCharacter.size}px`,
            height: `${selectedCharacter.size}px`,
            ...selectedCharacter.style,
            transition: 'transform 0.1s',
            transform: `${selectedCharacter.style.transform} translateY(${bounce}px)`,
          }}
        >
          {selectedCharacter.content}
        </div>

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: `${pipe.x}px`,
                top: 0,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.height}px`,
                backgroundColor: '#3CB371',
                border: '2px solid #2a8c51'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${pipe.x}px`,
                top: `${pipe.height + PIPE_GAP}px`,
                width: `${PIPE_WIDTH}px`,
                height: '500px',
                backgroundColor: '#3CB371',
                border: '2px solid #2a8c51'
              }}
            />
          </div>
        ))}

        {/* Score */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          fontSize: '48px', 
          fontFamily: "'Press Start 2P', cursive",
          color: 'white',
          textShadow: '2px 2px 0 #000'
        }}>
          {score}
        </div>

        {/* Character Selection Screen */}
        {showCharacterSelect && (
          <div className="character-select" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Press Start 2P', cursive",
            perspective: '1000px',
            zIndex: 1000
          }}>
            <h2 style={{ 
              marginBottom: '60px',
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '2px 2px 0 #000'
            }}>Select Character</h2>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              marginBottom: '40px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRotationAngle(prev => prev - 90);
                }}
                style={{
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '10px',
                  opacity: 0.8,
                  transition: 'opacity 0.2s'
                }}
              >
                ◀
              </button>
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '40px',
                  position: 'relative',
                  width: '400px',
                  height: '200px'
                }}
              >
                {(() => {
                  const characters = Object.values(CHARACTERS);
                  const currentIndex = Math.floor(Math.abs(rotationAngle / 90)) % characterCount;
                  const displayOrder = [
                    (currentIndex - 1 + characterCount) % characterCount,
                    currentIndex,
                    (currentIndex + 1) % characterCount
                  ];

                  return displayOrder.map((index) => {
                    const char = characters[index];
                    const isActive = index === currentIndex;

                    return (
                      <div
                        key={char.name}
                        className="character-option"
                        onClick={() => isActive && selectCharacter(char)}
                        style={{
                          cursor: isActive ? 'pointer' : 'default',
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '15px',
                          transition: 'all 0.3s ease',
                          opacity: isActive ? 1 : 0.3,
                          scale: isActive ? '1.2' : '0.8',
                          filter: isActive ? 'none' : 'blur(2px)',
                          pointerEvents: isActive ? 'auto' : 'none'
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            ...char.style,
                            transition: 'transform 0.2s'
                          }}
                        >
                          {char.content}
                        </div>
                        <span style={{ 
                          fontSize: '12px',
                          opacity: 0.8,
                          textAlign: 'center',
                          width: '100%',
                          whiteSpace: 'nowrap'
                        }}>{char.name}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRotationAngle(prev => prev + 90);
                }}
                style={{
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '10px',
                  opacity: 0.8,
                  transition: 'opacity 0.2s'
                }}
              >
                ▶
              </button>
            </div>
            <p style={{ 
              marginTop: '20px', 
              fontSize: '12px',
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Use Arrows to Navigate • Click to Select</p>
          </div>
        )}

        {/* Background Selection Screen */}
        {showBackgroundSelect && (
          <div className="background-select" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Press Start 2P', cursive",
            perspective: '1000px',
            zIndex: 1000
          }}>
            <h2 style={{ 
              marginBottom: '60px',
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '2px 2px 0 #000'
            }}>Select Weather</h2>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              marginBottom: '40px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBackgroundAngle(prev => prev - 90);
                }}
                style={{
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '10px',
                  opacity: 0.8,
                  transition: 'opacity 0.2s'
                }}
              >
                ◀
              </button>
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '40px',
                  position: 'relative',
                  width: '400px',
                  height: '200px'
                }}
              >
                {(() => {
                  const backgrounds = Object.values(BACKGROUNDS);
                  const currentIndex = Math.floor(Math.abs(backgroundAngle / 90)) % backgroundCount;
                  const displayOrder = [
                    (currentIndex - 1 + backgroundCount) % backgroundCount,
                    currentIndex,
                    (currentIndex + 1) % backgroundCount
                  ];

                  return displayOrder.map((index) => {
                    const bg = backgrounds[index];
                    const isActive = index === currentIndex;

                    return (
                      <div
                        key={bg.name}
                        className="background-option"
                        onClick={() => isActive && selectBackground(bg)}
                        style={{
                          cursor: isActive ? 'pointer' : 'default',
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '15px',
                          transition: 'all 0.3s ease',
                          opacity: isActive ? 1 : 0.3,
                          scale: isActive ? '1.2' : '0.8',
                          filter: isActive ? 'none' : 'blur(2px)',
                          pointerEvents: isActive ? 'auto' : 'none'
                        }}
                      >
                        <div style={{
                          width: '120px',
                          height: '80px',
                          backgroundColor: bg.name === 'Night Sky' ? bg.sky : '#87CEEB',
                          borderRadius: '8px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Weather Preview */}
                          {bg.name === 'Sunny Day' && (
                            <>
                              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px' }}>☀️</div>
                              <div style={{ position: 'absolute', top: '30px', left: '10px', fontSize: '16px' }}>🌤️</div>
                            </>
                          )}
                          {bg.name === 'Rainy Day' && (
                            <>
                              <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '24px' }}>🌈</div>
                              <div style={{ position: 'absolute', top: '15px', right: '10px', fontSize: '20px' }}>💧</div>
                              <div style={{ position: 'absolute', top: '35px', right: '25px', fontSize: '20px' }}>💧</div>
                              <div style={{ position: 'absolute', top: '25px', left: '20px', fontSize: '20px' }}>💧</div>
                            </>
                          )}
                          {bg.name === 'Forest' && (
                            <>
                              <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '24px' }}>🌲</div>
                              <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '24px' }}>🌲</div>
                              <div style={{ position: 'absolute', bottom: '10px', left: '40px', fontSize: '24px' }}>🌲</div>
                              <div style={{ position: 'absolute', bottom: '5px', left: '25px', fontSize: '16px' }}>🌸</div>
                              <div style={{ position: 'absolute', bottom: '5px', right: '25px', fontSize: '16px' }}>🌸</div>
                            </>
                          )}
                          {bg.name === 'Night Sky' && (
                            <>
                              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px' }}>🌙</div>
                              <div style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '16px' }}>⭐</div>
                              <div style={{ position: 'absolute', top: '35px', right: '25px', fontSize: '16px' }}>⭐</div>
                              <div style={{ position: 'absolute', top: '25px', left: '35px', fontSize: '16px' }}>⭐</div>
                            </>
                          )}
                          {bg.name === 'Snowy Day' && (
                            <>
                              <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '20px' }}>❄️</div>
                              <div style={{ position: 'absolute', top: '30px', right: '10px', fontSize: '20px' }}>❄️</div>
                              <div style={{ position: 'absolute', top: '20px', left: '30px', fontSize: '20px' }}>❄️</div>
                              <div style={{ position: 'absolute', top: '5px', right: '30px', fontSize: '20px' }}>❄️</div>
                            </>
                          )}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '20px',
                            backgroundColor: bg.ground
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: '12px',
                          opacity: 0.8,
                          textAlign: 'center',
                          width: '100%',
                          whiteSpace: 'nowrap'
                        }}>{bg.name}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBackgroundAngle(prev => prev + 90);
                }}
                style={{
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '10px',
                  opacity: 0.8,
                  transition: 'opacity 0.2s'
                }}
              >
                ▶
              </button>
            </div>
            <p style={{ 
              marginTop: '20px', 
              fontSize: '12px',
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Use Arrows to Navigate • Click to Select</p>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && !showCharacterSelect && !showBackgroundSelect && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            color: 'white',
            fontFamily: "'Press Start 2P', cursive",
            textAlign: 'center',
            textShadow: '2px 2px 0 #000'
          }}>
            <h1 style={{ marginBottom: '20px' }}>PIXEL FLAPPY</h1>
            <p style={{ marginBottom: '20px' }}>Flappy {selectedCharacter.name}</p>
            <p>Click or Press Space to Start</p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            color: 'white',
            fontFamily: "'Press Start 2P', cursive",
            textAlign: 'center',
            textShadow: '2px 2px 0 #000',
            border: '4px solid #4a4a4a',
            minWidth: '300px',
            zIndex: 1000
          }}>
            <h2 style={{ color: '#FF4444', marginBottom: '20px' }}>GAME OVER!</h2>
            <p style={{ fontSize: '24px', marginBottom: '10px' }}>Score: {score}</p>
            <p style={{ fontSize: '16px', marginBottom: '20px', color: score > highScore ? '#4CAF50' : '#FFF' }}>
              {score > highScore ? 'New High Score!' : `High Score: ${highScore}`}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              style={{
                backgroundColor: '#4CAF50',
                padding: '15px 30px',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 