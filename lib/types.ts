export type GameScreen =
  | 'home' | 'modeSelect' | 'hotSeatTransition'
  | 'duel' | 'roundResult' | 'gameOver' | 'leaderboard';

export type GameMode = 'clasico' | 'escalada';

export type HotSeatPhase =
  | { type: 'transition'; jugadorIndex: number }
  | { type: 'selecting'; jugadorIndex: number }
  | { type: 'transition_reveal' }
  | { type: 'revealing' };

export interface RondaConfig {
  numero: number;
  rangoMin: number;
  rangoMax: number;
  umbral: number;
}

export interface Player {
  id: string;
  nombre: string;
  hp: number;
  hpMax: number;
  numeroSeleccionado: number | null;
  eliminado: boolean;
}

export interface RondaRecord {
  ronda: number;
  numeros: { jugadorId: string; valor: number }[];
  suma: number;
  umbral: number;
  mundo: 'alto' | 'bajo';
  valorGanador: number;
  ganadores: string[];
  danos: { jugadorId: string; cantidad: number }[];
  golpePerfecto: boolean;
  jugadorGolpeado?: string;
}

export interface FinPartidaResult {
  ganadores: string[];
  clasificacion: { jugadorId: string; hp: number; puesto: number }[];
}

export interface GameState {
  screen: GameScreen;
  modo: GameMode | null;
  rondaActual: number;
  totalRondas: number;
  rondaConfig: RondaConfig;
  hotSeatPhase: HotSeatPhase | null;
  jugadores: Player[];
  historialRondas: RondaRecord[];
  golpePerfectoOcurrido: boolean;
  finPartida: FinPartidaResult | null;
}

export interface PlayerStorage {
  puntosTotales: number;
  expulsado: boolean;
  victoriasConsecutivasDesdeExpulsion: number;
}

export interface PartidaRecord {
  fecha: string;
  jugadores: string[];
  modo: GameMode;
  nJugadores: number;
  clasificacion: { nombre: string; hp: number; puesto: number }[];
  ganador: string;
  puntosClase: { nombre: string; puntos: number }[];
  rondasJugadas: RondaRecord[];
  golpePerfecto: boolean;
}

export interface StorageData {
  jugadores: { [nombre: string]: PlayerStorage };
  historial: PartidaRecord[];
}
