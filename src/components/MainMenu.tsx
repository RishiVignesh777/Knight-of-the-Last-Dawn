import React, { useState } from 'react';
import { Play, RotateCcw, BookOpen, Compass, Volume2, VolumeX, Shield, Sun } from 'lucide-react';
import { soundEngine } from '../audio/soundManager';

interface MainMenuProps {
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ hasSave, onNewGame, onContinue }) => {
  const [showStory, setShowStory] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between p-6 select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden">
      {/* Background celestial glow & distant ruined towers silhouette */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-amber-950/40 via-transparent to-transparent" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top Header bar with sound toggle */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-amber-400/80 font-retro text-xs tracking-wider">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>ELDORIA CHRONICLES</span>
        </div>
        <button
          onClick={handleToggleMute}
          className="p-2 rounded bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Center Title Card */}
      <div className="text-center z-10 my-auto max-w-2xl px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-retro text-[10px] tracking-widest uppercase mb-4 shadow-sm">
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>The Heart of Dawn has Shattered</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 tracking-wider drop-shadow-md">
          KNIGHT OF THE LAST DAWN
        </h1>

        <p className="font-cinzel text-slate-400 text-xs sm:text-sm md:text-base max-w-lg mx-auto mt-3 mb-8 leading-relaxed">
          Guide Sir Cael through the ruined kingdom of Eldoria to the ancient Tower of Dawn before the final light disappears forever.
        </p>

        {/* Menu Buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
          {hasSave && (
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-retro font-bold text-xs rounded border border-amber-400 shadow-xl transition transform hover:scale-[1.02] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Continue Journey</span>
            </button>
          )}

          <button
            onClick={onNewGame}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded border font-retro text-xs transition transform hover:scale-[1.02] cursor-pointer shadow-lg ${
              hasSave
                ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/50'
                : 'bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-400'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{hasSave ? 'New Journey (Reset)' : 'Begin Journey'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2 w-full mt-1">
            <button
              onClick={() => setShowStory(true)}
              className="flex items-center justify-center gap-1.5 py-2 bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded font-retro text-[10px] transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Prologue</span>
            </button>
            <button
              onClick={() => setShowControls(true)}
              className="flex items-center justify-center gap-1.5 py-2 bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded font-retro text-[10px] transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Controls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl flex items-center justify-between text-slate-500 font-retro text-[10px] z-10 border-t border-slate-800/80 pt-3">
        <span>A Cinematic 2D Pixel-Art Action Adventure</span>
        <span>Keyboard & Gamepad Supported</span>
      </div>

      {/* Story Prologue Modal */}
      {showStory && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-950 border border-amber-500/60 p-6 rounded shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-cinzel font-bold text-amber-400 text-base">The Fall of Eldoria</h3>
              <button
                onClick={() => setShowStory(false)}
                className="font-retro text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 font-cinzel text-xs sm:text-sm text-slate-300 leading-relaxed max-h-72 overflow-y-auto pr-1">
              <p>
                The kingdom of <strong>Eldoria</strong> was once protected by a magical crystal called the <strong>Heart of Dawn</strong>.
                Its celestial warmth nourished the fields and kept the creeping shadows at bay.
              </p>
              <p>
                One night, the ward breached. The crystal shattered.
              </p>
              <p>
                Forests turned corrupt, rivers turned to ink, and ancient soldiers awakened as hollow husks.
                You control <strong>Sir Cael</strong>, a forgotten royal knight who once bore the duty to defend the sanctuary.
              </p>
              <p className="italic text-amber-200 bg-slate-900/90 p-2.5 rounded border-l-2 border-amber-400">
                “When the final light reaches the tower, remember what you promised.”
              </p>
              <p>
                Cael travels across five ruined realms toward the Tower of Dawn, seeking atonement for the night he could not prevent.
              </p>
            </div>
            <button
              onClick={() => setShowStory(false)}
              className="mt-4 w-full py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 rounded font-retro text-xs transition cursor-pointer"
            >
              Return
            </button>
          </div>
        </div>
      )}

      {/* Controls Modal */}
      {showControls && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-950 border border-sky-500/60 p-6 rounded shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="font-cinzel font-bold text-sky-400 text-base">Knight Controls</h3>
              <button
                onClick={() => setShowControls(false)}
                className="font-retro text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-retro">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">A / D or ◄ / ►</span>
                <span className="text-slate-300 text-[10px]">Move Left / Right</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">SPACE</span>
                <span className="text-slate-300 text-[10px]">Jump / Climb Ledges</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">SHIFT</span>
                <span className="text-slate-300 text-[10px]">Dash (Evade i-frames)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">J</span>
                <span className="text-slate-300 text-[10px]">Light Sword Slash</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">K</span>
                <span className="text-slate-300 text-[10px]">Heavy Cleave Attack</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block mb-1">L</span>
                <span className="text-slate-300 text-[10px]">Block / Guard</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 col-span-2">
                <span className="text-amber-400 block mb-1">E</span>
                <span className="text-slate-300 text-[10px]">Interact (Shrines, NPCs, Doors, Shards)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 col-span-2">
                <span className="text-sky-400 block mb-1">GAMEPAD SUPPORT</span>
                <span className="text-slate-300 text-[10px]">Plug-and-play Xbox / PlayStation / Generic controllers!</span>
              </div>
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="mt-4 w-full py-2 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/50 rounded font-retro text-xs transition cursor-pointer"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
