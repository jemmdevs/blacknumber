'use client';

import { GameProvider, useGame } from '@/store/gameStore';
import HomeScreen from '@/components/screens/HomeScreen';
import ModeSelectScreen from '@/components/screens/ModeSelectScreen';
import DuelScreen from '@/components/screens/DuelScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';
import HotSeatTransition from '@/components/game/HotSeatTransition';
import RoundResultOverlay from '@/components/game/RoundResultOverlay';

function GameRoot() {
  const { state, advanceHotseat, nextRound, navigate } = useGame();
  const { screen, hotSeatPhase, jugadores, historialRondas, finPartida } = state;

  if (screen === 'hotSeatTransition' && hotSeatPhase) {
    if (hotSeatPhase.type === 'transition') {
      const jugador = jugadores[hotSeatPhase.jugadorIndex];
      return (
        <HotSeatTransition
          type="player"
          playerName={jugador?.nombre}
          onContinue={advanceHotseat}
        />
      );
    }
    if (hotSeatPhase.type === 'transition_reveal') {
      return <HotSeatTransition type="reveal" onContinue={advanceHotseat} />;
    }
  }

  if (screen === 'duel') return <DuelScreen />;

  if (screen === 'roundResult') {
    const lastRonda = historialRondas[historialRondas.length - 1];
    if (!lastRonda) return null;
    return (
      <RoundResultOverlay
        ronda={lastRonda}
        jugadores={jugadores}
        finPartida={finPartida}
        onNextRound={nextRound}
        onEndGame={() => navigate('gameOver')}
      />
    );
  }

  if (screen === 'modeSelect') return <ModeSelectScreen />;
  if (screen === 'gameOver') return <GameOverScreen />;

  return <HomeScreen />;
}

export default function Page() {
  return (
    <GameProvider>
      <GameRoot />
    </GameProvider>
  );
}
