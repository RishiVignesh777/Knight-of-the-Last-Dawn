import React, { useEffect, useRef, useState, useCallback } from 'react';
import { game } from './game/gameEngine';
import { GameState, EndingType } from './types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './game/constants';
import { HUD } from './components/HUD';
import { DialogueModal } from './components/DialogueModal';
import { MemoryShardModal, LandmarkModal } from './components/MemoryShardModal';
import { EndingModal } from './components/EndingModal';
import { PauseMenu } from './components/PauseMenu';
import { GameOverModal } from './components/GameOverModal';
import { MainMenu } from './components/MainMenu';
import { ControlsOverlay } from './components/ControlsOverlay';
import { Bestiary } from './components/Bestiary';
import { AchievementToast } from './components/AchievementToast';
import { soundEngine } from './audio/soundManager';
import { controlsManager } from './game/controlsManager';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // React state synchronized for overlays
  const [gameState, setGameState] = useState<GameState>(game.state);
  const [currentAreaId, setCurrentAreaId] = useState(game.currentAreaId);
  const [playerHp, setPlayerHp] = useState(game.player.hp);
  const [playerStamina, setPlayerStamina] = useState(game.player.stamina);
  const [playerDawn, setPlayerDawn] = useState(game.player.dawnEnergy);
  const [shardsCount, setShardsCount] = useState(game.player.memoryShards.length);
  const [bossHp, setBossHp] = useState<number | null>(null);

  const [activeDialogue, setActiveDialogue] = useState(game.activeDialogue);
  const [activeMemory, setActiveMemory] = useState(game.activeMemoryModal);
  const [activeLandmark, setActiveLandmark] = useState(game.activeLandmarkText);
  const [endingChoice, setEndingChoice] = useState<EndingType | null>(game.activeEndingChoice);
  const [epilogueStep, setEpilogueStep] = useState(game.endingEpilogueStep);

  const [crtEnabled, setCrtEnabled] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(game.hasSave());
  const [discoveryToast, setDiscoveryToast] = useState(game.bestiaryDiscoveryToast);
  const [achievementToast, setAchievementToast] = useState(game.activeAchievementToast);
  const [pauseInitialTab, setPauseInitialTab] = useState<'main' | 'controls' | 'codex' | 'bestiary' | 'achievements' | 'sound'>('main');

  // Input event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Audio activation on first interaction
      soundEngine.enableAudio();

      if (e.code === 'Escape') {
        e.preventDefault();
        if (game.state === GameState.BESTIARY) {
          game.state = GameState.PLAYING;
          setGameState(GameState.PLAYING);
          soundEngine.playMenuBeep(false);
          return;
        }
        if (game.state === GameState.PLAYING) {
          setPauseInitialTab('main');
          game.state = GameState.PAUSED;
          setGameState(GameState.PAUSED);
        } else if (game.state === GameState.PAUSED) {
          game.state = GameState.PLAYING;
          setGameState(GameState.PLAYING);
        }
        return;
      }

      if (e.code === 'KeyB') {
        if (game.state === GameState.PLAYING) {
          game.state = GameState.BESTIARY;
          setGameState(GameState.BESTIARY);
          soundEngine.playMenuBeep(true);
        } else if (game.state === GameState.BESTIARY) {
          game.state = GameState.PLAYING;
          setGameState(GameState.PLAYING);
          soundEngine.playMenuBeep(false);
        }
        return;
      }

      if (game.state === GameState.GAME_OVER) {
        if (e.code === 'Space' || controlsManager.isActionKey('interact', e.code) || controlsManager.isActionKey('jump', e.code)) {
          handleRespawn();
        }
        return;
      }

      if (game.state === GameState.DIALOGUE) {
        if (e.code === 'Space' || controlsManager.isActionKey('interact', e.code)) {
          handleNextDialogue();
        }
        return;
      }

      if (game.state === GameState.MEMORY_VIEW) {
        if (e.code === 'Space' || controlsManager.isActionKey('interact', e.code)) {
          handleCloseMemory();
        }
        return;
      }

      if (game.state === GameState.ENDING_CUTSCENE) {
        if (e.code === 'Space' || controlsManager.isActionKey('interact', e.code)) {
          handleNextEpilogueStep();
        }
        return;
      }

      // Movement & Combat keys mapped via controlsManager
      const actions = controlsManager.getActionsForCode(e.code);
      if (actions.length > 0) {
        for (const action of actions) {
          game.keys[action] = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const actions = controlsManager.getActionsForCode(e.code);
      if (actions.length > 0) {
        for (const action of actions) {
          game.keys[action] = false;
        }
      }
    };

    const handleBlur = () => {
      for (const k of Object.keys(game.keys) as (keyof typeof game.keys)[]) {
        game.keys[k] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure crisp pixel art rendering
    ctx.imageSmoothingEnabled = false;

    let lastTime = performance.now();
    let animationFrameId: number;
    let syncCounter = 0;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update engine
      game.update(dt);

      // Render world
      game.render(ctx);

      // Throttle React state sync to ~15fps for maximum performance
      syncCounter++;
      if (syncCounter % 4 === 0) {
        setGameState(game.state);
        setCurrentAreaId(game.currentAreaId);
        setPlayerHp(game.player.hp);
        setPlayerStamina(game.player.stamina);
        setPlayerDawn(game.player.dawnEnergy);
        setShardsCount(game.player.memoryShards.length);

        const boss = game.enemies.find(e => e.isBoss);
        setBossHp(boss ? boss.hp : null);

        setActiveDialogue(game.activeDialogue);
        setActiveMemory(game.activeMemoryModal);
        setActiveLandmark(game.activeLandmarkText);
        setEndingChoice(game.activeEndingChoice);
        setEpilogueStep(game.endingEpilogueStep);
        setDiscoveryToast(game.bestiaryDiscoveryToast ? { ...game.bestiaryDiscoveryToast } : null);
        setAchievementToast(game.activeAchievementToast ? { ...game.activeAchievementToast } : null);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handlers for UI actions
  const handleStartNewGame = () => {
    game.startNewGame();
    setGameState(GameState.PLAYING);
    setHasSavedGame(true);
  };

  const handleContinue = () => {
    if (game.continueGame()) {
      setGameState(GameState.PLAYING);
    }
  };

  const handleOpenAchievements = () => {
    setPauseInitialTab('achievements');
    game.state = GameState.PAUSED;
    setGameState(GameState.PAUSED);
    soundEngine.playMenuBeep(true);
  };

  const handleRespawn = () => {
    const p = game.player;
    p.hp = p.maxHp;
    p.stamina = p.maxStamina;
    p.dawnEnergy = Math.max(20, p.dawnEnergy);
    p.action = 'idle' as any;
    p.vx = 0;
    p.vy = 0;
    
    // Respawn at checkpoint
    const cp = p.currentCheckpoint || { areaId: game.currentAreaId, x: 80, y: 280 };
    game.loadArea(cp.areaId, false);
    p.x = cp.x;
    p.y = cp.y;
    game.state = GameState.PLAYING;
    setGameState(GameState.PLAYING);
  };

  const handleNextDialogue = () => {
    if (!game.activeDialogue) return;
    if (game.activeDialogue.currentLine < game.activeDialogue.lines.length - 1) {
      game.activeDialogue.currentLine++;
      setActiveDialogue({ ...game.activeDialogue });
      soundEngine.playMenuBeep(false);
    } else {
      game.activeDialogue = null;
      game.state = GameState.PLAYING;
      setActiveDialogue(null);
      setGameState(GameState.PLAYING);
      soundEngine.playMenuBeep(true);
    }
  };

  const handleCloseMemory = () => {
    game.activeMemoryModal = null;
    game.state = GameState.PLAYING;
    setActiveMemory(null);
    setGameState(GameState.PLAYING);
    soundEngine.playMenuBeep(true);
  };

  const handleCloseLandmark = () => {
    game.activeLandmarkText = null;
    setActiveLandmark(null);
  };

  const handleOpenBestiary = () => {
    game.state = GameState.BESTIARY;
    setGameState(GameState.BESTIARY);
    soundEngine.playMenuBeep(true);
  };

  const handleCloseBestiary = () => {
    game.state = GameState.PLAYING;
    setGameState(GameState.PLAYING);
    soundEngine.playMenuBeep(false);
  };

  const handleSelectEnding = (choice: EndingType) => {
    game.chooseEnding(choice);
    setEndingChoice(choice);
    setGameState(GameState.ENDING_CUTSCENE);
    setEpilogueStep(0);
  };

  const handleNextEpilogueStep = () => {
    if (game.endingEpilogueStep < game.endingEpilogueText.length - 1) {
      game.endingEpilogueStep++;
      setEpilogueStep(game.endingEpilogueStep);
      soundEngine.playMenuBeep(false);
    }
  };

  const handleRestartToTitle = () => {
    game.state = GameState.MENU;
    setGameState(GameState.MENU);
    soundEngine.playMusicForArea('MENU');
  };

  const bossEnemy = game.enemies.find(e => e.isBoss && e.state !== 'dead');

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none font-sans">
      {/* Aspect-Ratio Preserving Game Container */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] aspect-16/9 flex items-center justify-center bg-black overflow-hidden shadow-2xl">
        {/* Main Pixel Canvas */}
        <canvas
          ref={canvasRef}
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          className="w-full h-full object-contain pixelated pointer-events-none"
        />

        {/* Optional CRT Scanline & Phosphor Overlay */}
        {crtEnabled && (
          <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-40 z-30" />
        )}

        {/* In-Game HUD (Visible during gameplay & dialogue) */}
        {(gameState === GameState.PLAYING || gameState === GameState.DIALOGUE || gameState === GameState.MEMORY_VIEW) && (
          <HUD
            player={game.player}
            currentAreaId={currentAreaId}
            bossEnemy={bossEnemy}
            discoveryToast={discoveryToast}
            onOpenBestiary={handleOpenBestiary}
            onOpenAchievements={handleOpenAchievements}
          />
        )}

        {/* Mobile / Touchscreen controls overlay */}
        {gameState === GameState.PLAYING && <ControlsOverlay />}

        {/* Main Menu Screen */}
        {gameState === GameState.MENU && (
          <MainMenu
            hasSave={hasSavedGame}
            onNewGame={handleStartNewGame}
            onContinue={handleContinue}
          />
        )}

        {/* Pause Menu Screen */}
        {gameState === GameState.PAUSED && (
          <PauseMenu
            player={game.player}
            crtEnabled={crtEnabled}
            initialTab={pauseInitialTab}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            onResume={() => {
              game.state = GameState.PLAYING;
              setGameState(GameState.PLAYING);
            }}
            onQuitToMenu={handleRestartToTitle}
          />
        )}

        {/* Bestiary Codex Screen */}
        {gameState === GameState.BESTIARY && (
          <Bestiary
            discoveredEnemyIds={game.player.discoveredEnemies || []}
            onClose={handleCloseBestiary}
          />
        )}

        {/* NPC Dialogue Modal */}
        {gameState === GameState.DIALOGUE && activeDialogue && (
          <DialogueModal
            npcName={activeDialogue.npcName}
            npcTitle={activeDialogue.npcTitle}
            lines={activeDialogue.lines}
            currentLine={activeDialogue.currentLine}
            onNext={handleNextDialogue}
            onClose={handleNextDialogue}
          />
        )}

        {/* Memory Shard Lore Modal */}
        {gameState === GameState.MEMORY_VIEW && activeMemory && (
          <MemoryShardModal
            shard={activeMemory}
            onClose={handleCloseMemory}
          />
        )}

        {/* Landmark / Shrine Modal */}
        {activeLandmark && (
          <LandmarkModal
            text={activeLandmark}
            onClose={handleCloseLandmark}
          />
        )}

        {/* Climax & Ending Sequence */}
        {(gameState === GameState.ENDING_CHOICE || gameState === GameState.ENDING_CUTSCENE) && (
          <EndingModal
            isChoicePhase={gameState === GameState.ENDING_CHOICE}
            chosenEnding={endingChoice}
            epilogueLines={game.endingEpilogueText}
            currentStep={epilogueStep}
            onSelectEnding={handleSelectEnding}
            onNextStep={handleNextEpilogueStep}
            onRestartGame={handleRestartToTitle}
          />
        )}

        {/* Game Over Screen */}
        {gameState === GameState.GAME_OVER && (
          <GameOverModal
            onRespawn={handleRespawn}
            onQuitToMenu={handleRestartToTitle}
          />
        )}

        {/* Global Achievement Unlocked Toast Notification */}
        {achievementToast && (
          <AchievementToast
            achievement={achievementToast.achievement}
            onClose={() => {
              game.activeAchievementToast = null;
              setAchievementToast(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
