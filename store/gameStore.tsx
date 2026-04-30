'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  GameState,
  GameScreen,
  GameMode,
  Player,
} from '@/lib/types';
import {
  calcularRondaConfig,
  resolverRonda,
  aplicarDanos,
  verificarFinPartida,
  HP_CONFIG,
} from '@/lib/gameEngine';

type GameAction =
  | { type: 'NAVIGATE'; screen: GameScreen }
  | { type: 'INIT_GAME'; nombres: string[]; modo: GameMode }
  | { type: 'ADVANCE_HOTSEAT' }
  | { type: 'CONFIRM_SELECTION'; valor: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET' };

const INITIAL_STATE: GameState = {
  screen: 'home',
  modo: null,
  rondaActual: 1,
  totalRondas: 5,
  rondaConfig: { numero: 1, rangoMin: 1, rangoMax: 10, umbral: 10 },
  hotSeatPhase: null,
  jugadores: [],
  historialRondas: [],
  golpePerfectoOcurrido: false,
  finPartida: null,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };

    case 'INIT_GAME': {
      const n = action.nombres.length;
      const hp = HP_CONFIG[n] ?? 10;
      const rondaConfig = calcularRondaConfig(action.modo, 1, n);
      const jugadores: Player[] = action.nombres.map((nombre, i) => ({
        id: `j${i + 1}`,
        nombre,
        hp,
        hpMax: hp,
        numeroSeleccionado: null,
        eliminado: false,
      }));
      return {
        ...INITIAL_STATE,
        screen: 'hotSeatTransition',
        modo: action.modo,
        rondaActual: 1,
        totalRondas: 5,
        rondaConfig,
        hotSeatPhase: { type: 'transition', jugadorIndex: 0 },
        jugadores,
      };
    }

    case 'ADVANCE_HOTSEAT': {
      const { hotSeatPhase, jugadores, rondaConfig, historialRondas, rondaActual, totalRondas } =
        state;
      if (!hotSeatPhase) return state;

      if (hotSeatPhase.type === 'transition') {
        return {
          ...state,
          screen: 'duel',
          hotSeatPhase: { type: 'selecting', jugadorIndex: hotSeatPhase.jugadorIndex },
        };
      }

      if (hotSeatPhase.type === 'transition_reveal') {
        const numeros = jugadores
          .filter(j => !j.eliminado)
          .map(j => ({ jugadorId: j.id, valor: j.numeroSeleccionado! }));

        const rondaRecord = resolverRonda(numeros, rondaConfig);
        const nuevosJugadores = aplicarDanos(jugadores, rondaRecord);
        const finPartida = verificarFinPartida(nuevosJugadores, rondaActual, totalRondas);

        return {
          ...state,
          screen: 'roundResult',
          hotSeatPhase: { type: 'revealing' },
          jugadores: nuevosJugadores,
          historialRondas: [...historialRondas, rondaRecord],
          finPartida,
          golpePerfectoOcurrido: state.golpePerfectoOcurrido || rondaRecord.golpePerfecto,
        };
      }

      return state;
    }

    case 'CONFIRM_SELECTION': {
      const { hotSeatPhase, jugadores } = state;
      if (!hotSeatPhase || hotSeatPhase.type !== 'selecting') return state;

      const currentIdx = hotSeatPhase.jugadorIndex;
      const updatedJugadores = jugadores.map((j, i) =>
        i === currentIdx ? { ...j, numeroSeleccionado: action.valor } : j
      );

      let nextIdx: number | null = null;
      for (let i = currentIdx + 1; i < updatedJugadores.length; i++) {
        if (!updatedJugadores[i].eliminado) {
          nextIdx = i;
          break;
        }
      }

      if (nextIdx !== null) {
        return {
          ...state,
          jugadores: updatedJugadores,
          screen: 'hotSeatTransition',
          hotSeatPhase: { type: 'transition', jugadorIndex: nextIdx },
        };
      }
      return {
        ...state,
        jugadores: updatedJugadores,
        screen: 'hotSeatTransition',
        hotSeatPhase: { type: 'transition_reveal' },
      };
    }

    case 'NEXT_ROUND': {
      const { rondaActual, modo, jugadores } = state;
      const n = jugadores.length;
      const newRonda = rondaActual + 1;
      const newConfig = calcularRondaConfig(modo!, newRonda, n);
      const resetJugadores = jugadores.map(j => ({ ...j, numeroSeleccionado: null }));
      const firstActive = resetJugadores.findIndex(j => !j.eliminado);

      return {
        ...state,
        screen: 'hotSeatTransition',
        rondaActual: newRonda,
        rondaConfig: newConfig,
        hotSeatPhase: { type: 'transition', jugadorIndex: firstActive >= 0 ? firstActive : 0 },
        jugadores: resetJugadores,
        finPartida: null,
      };
    }

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  navigate: (screen: GameScreen) => void;
  initGame: (nombres: string[], modo: GameMode) => void;
  advanceHotseat: () => void;
  confirmSelection: (valor: number) => void;
  nextRound: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const value: GameContextValue = {
    state,
    navigate: (screen) => dispatch({ type: 'NAVIGATE', screen }),
    initGame: (nombres, modo) => dispatch({ type: 'INIT_GAME', nombres, modo }),
    advanceHotseat: () => dispatch({ type: 'ADVANCE_HOTSEAT' }),
    confirmSelection: (valor) => dispatch({ type: 'CONFIRM_SELECTION', valor }),
    nextRound: () => dispatch({ type: 'NEXT_ROUND' }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
