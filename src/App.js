import React, { useState, useEffect } from 'react';
import { Target, Trophy, RotateCcw, Users } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState(null);
  const [showSetup, setShowSetup] = useState(true);
  const [setupForm, setSetupForm] = useState({
    players: ['Hráč 1', 'Hráč 2'],
    startingScore: 501,
    checkoutRule: 'double',
    isMultiplayer: false,
    gameId: ''
  });
  const [scoreInput, setScoreInput] = useState('');

  // Load game from storage on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Auto-refresh multiplayer games
  useEffect(() => {
    if (gameState?.isMultiplayer && !showSetup) {
      const interval = setInterval(loadGame, 2000);
      return () => clearInterval(interval);
    }
  }, [gameState?.isMultiplayer, showSetup]);

  const loadGame = async () => {
    try {
      const result = await window.storage.get('darts-game', setupForm.isMultiplayer);
      if (result?.value) {
        const game = JSON.parse(result.value);
        setGameState(game);
        setShowSetup(false);
      }
    } catch (error) {
      console.log('No saved game found');
    }
  };

  const saveGame = async (game) => {
    try {
      await window.storage.set('darts-game', JSON.stringify(game), game.isMultiplayer);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const startNewGame = async () => {
    const newGame = {
      players: setupForm.players.map((name, idx) => ({
        id: idx,
        name: name || `Hráč ${idx + 1}`,
        score: setupForm.startingScore,
        history: []
      })),
      currentPlayerIndex: 0,
      startingScore: setupForm.startingScore,
      checkoutRule: setupForm.checkoutRule,
      isMultiplayer: setupForm.isMultiplayer,
      winner: null,
      gameId: setupForm.isMultiplayer ? setupForm.gameId || Date.now().toString() : null
    };

    setGameState(newGame);
    await saveGame(newGame);
    setShowSetup(false);
  };

  const addPlayer = () => {
    if (setupForm.players.length < 6) {
      setSetupForm({
        ...setupForm,
        players: [...setupForm.players, `Player ${setupForm.players.length + 1}`]
      });
    }
  };

  const removePlayer = (index) => {
    if (setupForm.players.length > 2) {
      const newPlayers = setupForm.players.filter((_, i) => i !== index);
      setSetupForm({ ...setupForm, players: newPlayers });
    }
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...setupForm.players];
    newPlayers[index] = name;
    setSetupForm({ ...setupForm, players: newPlayers });
  };

  const submitScore = async () => {
    if (!scoreInput || gameState.winner) return;

    const score = parseInt(scoreInput);
    if (isNaN(score) || score < 0 || score > 180) {
      alert('Neplatné skóre. Musí být mezi 0 a 180.');
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const newScore = currentPlayer.score - score;

    // Check for bust
    if (newScore < 0 || newScore === 1) {
      alert('Přetočení! Skóre zůstává nezměněno.');
      const updatedGame = {
        ...gameState,
        currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length
      };
      setGameState(updatedGame);
      await saveGame(updatedGame);
      setScoreInput('');
      return;
    }

    // Check for checkout rules
    if (newScore === 0) {
      if (gameState.checkoutRule === 'double' && !scoreInput.toLowerCase().includes('d')) {
        alert('Musíte skončit na double!');
        const updatedGame = {
          ...gameState,
          currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length
        };
        setGameState(updatedGame);
        await saveGame(updatedGame);
        setScoreInput('');
        return;
      }

      // Winner!
      const updatedPlayers = [...gameState.players];
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        score: 0,
        history: [...currentPlayer.history, score]
      };

      const updatedGame = {
        ...gameState,
        players: updatedPlayers,
        winner: currentPlayer.name
      };

      setGameState(updatedGame);
      await saveGame(updatedGame);
      setScoreInput('');
      return;
    }

    // Normal score update
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      score: newScore,
      history: [...currentPlayer.history, score]
    };

    const updatedGame = {
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length
    };

    setGameState(updatedGame);
    await saveGame(updatedGame);
    setScoreInput('');
  };

  const resetGame = async () => {
    try {
      await window.storage.delete('darts-game', gameState?.isMultiplayer);
      setGameState(null);
      setShowSetup(true);
      setScoreInput('');
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Target className="w-20 h-20 mx-auto mb-4 text-amber-400" strokeWidth={1.5} />
            <h1 className="text-6xl font-bold mb-2 tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                ŠIPKY
              </span>
            </h1>
            <p className="text-slate-400 text-lg tracking-wide">Profesionální bodovací systém</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="space-y-6">
              {/* Players */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3 tracking-wide">HRÁČI</label>
                <div className="space-y-2">
                  {setupForm.players.map((player, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayerName(idx, e.target.value)}
                        className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder={`Hráč ${idx + 1}`}
                      />
                      {setupForm.players.length > 2 && (
                        <button
                          onClick={() => removePlayer(idx)}
                          className="px-4 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {setupForm.players.length < 6 && (
                  <button
                    onClick={addPlayer}
                    className="mt-3 w-full py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    + Přidat hráče
                  </button>
                )}
              </div>

              {/* Starting Score */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3 tracking-wide">POČÁTEČNÍ SKÓRE</label>
                <div className="grid grid-cols-3 gap-2">
                  {[301, 501, 701].map((score) => (
                    <button
                      key={score}
                      onClick={() => setSetupForm({ ...setupForm, startingScore: score })}
                      className={`py-3 rounded-lg font-bold text-lg transition-all ${
                        setupForm.startingScore === score
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkout Rule */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3 tracking-wide">PRAVIDLO ZAKONČENÍ</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'double', label: 'Double Out' },
                    { value: 'single', label: 'Single Out' }
                  ].map((rule) => (
                    <button
                      key={rule.value}
                      onClick={() => setSetupForm({ ...setupForm, checkoutRule: rule.value })}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        setupForm.checkoutRule === rule.value
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rule.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiplayer Toggle */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3 tracking-wide">REŽIM HRY</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSetupForm({ ...setupForm, isMultiplayer: false })}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      !setupForm.isMultiplayer
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Místní
                  </button>
                  <button
                    onClick={() => setSetupForm({ ...setupForm, isMultiplayer: true })}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      setupForm.isMultiplayer
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Users className="inline w-5 h-5 mr-1" />
                    Více hráčů
                  </button>
                </div>
                {setupForm.isMultiplayer && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={setupForm.gameId}
                      onChange={(e) => setSetupForm({ ...setupForm, gameId: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID hry (nechte prázdné pro novou hru)"
                    />
                    <p className="text-slate-400 text-xs mt-2">Sdílejte ID hry s ostatními hráči</p>
                  </div>
                )}
              </div>

              {/* Start Button */}
              <button
                onClick={startNewGame}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ZAČÍT HRU
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
          * {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </div>
    );
  }

  if (!gameState) return null;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = true; // In real multiplayer, you'd check player identity

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                ŠIPKY
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {gameState.checkoutRule === 'double' ? 'Double Out' : 'Single Out'} • {gameState.startingScore}
              {gameState.isMultiplayer && <span className="ml-2">• 🌐 Více hráčů</span>}
            </p>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Nová hra
          </button>
        </div>

        {/* Winner Banner */}
        {gameState.winner && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center animate-pulse">
            <Trophy className="w-16 h-16 mx-auto mb-3 text-white" />
            <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              {gameState.winner} VYHRÁVÁ!
            </h2>
            <p className="text-white/90">Gratulujeme k vítězství!</p>
          </div>
        )}

        {/* Score Input */}
        {!gameState.winner && (
          <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-slate-400 text-sm mb-2 font-semibold tracking-wide">
                  AKTUÁLNÍ KOL: {currentPlayer.name}
                </label>
                <input
                  type="text"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && isMyTurn && submitScore()}
                  disabled={!isMyTurn}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-4 text-white text-2xl font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Zadejte skóre (0-180)"
                />
                <p className="text-slate-500 text-xs mt-2">
                  {gameState.checkoutRule === 'double' && 'Přidejte "d" za skóre pro double zakončení (např. "20d")'}
                </p>
              </div>
              <button
                onClick={submitScore}
                disabled={!isMyTurn || !scoreInput}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-fit whitespace-nowrap"
              >
                Odeslat
              </button>
            </div>
          </div>
        )}

        {/* Player Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameState.players.map((player, idx) => {
            const isCurrent = idx === gameState.currentPlayerIndex;
            const isWinner = gameState.winner === player.name;

            return (
              <div
                key={player.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all ${
                  isCurrent && !gameState.winner
                    ? 'border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
                    : isWinner
                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                    : 'border-slate-700/50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{player.name}</h3>
                    {isCurrent && !gameState.winner && (
                      <span className="inline-block mt-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                        AKTIVNÍ
                      </span>
                    )}
                    {isWinner && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                        VÍTĚZ
                      </span>
                    )}
                  </div>
                  <Target className="w-8 h-8 text-slate-600" />
                </div>

                <div className="mb-4">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    {player.score}
                  </div>
                  <div className="text-slate-400 text-sm mt-1">zbývajících bodů</div>
                </div>

                {player.history.length > 0 && (
                  <div>
                    <div className="text-slate-400 text-xs font-semibold mb-2">POSLEDNÍ SKÓRE</div>
                    <div className="flex flex-wrap gap-1">
                      {player.history.slice(-5).map((score, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                          {score}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Inter', sans-serif;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
