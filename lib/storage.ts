import { StorageData, PartidaRecord, PlayerStorage } from './types';

const STORAGE_KEY = 'threshold_data';

function getStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { jugadores: {}, historial: [] };
    return JSON.parse(raw) as StorageData;
  } catch {
    return { jugadores: {}, historial: [] };
  }
}

function setStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage not available — game still works
  }
}

export function getPlayerData(nombre: string): PlayerStorage {
  const data = getStorage();
  return data.jugadores[nombre] ?? {
    puntosTotales: 0,
    expulsado: false,
    victoriasConsecutivasDesdeExpulsion: 0,
  };
}

export function updatePlayers(
  updates: { nombre: string; puntos: number; esPrimero: boolean }[]
): { nombre: string; rehabilitado: boolean }[] {
  const data = getStorage();
  const rehabilitados: { nombre: string; rehabilitado: boolean }[] = [];

  for (const { nombre, puntos, esPrimero } of updates) {
    const existing: PlayerStorage = data.jugadores[nombre] ?? {
      puntosTotales: 0,
      expulsado: false,
      victoriasConsecutivasDesdeExpulsion: 0,
    };

    existing.puntosTotales += puntos;

    let rehabilitado = false;
    if (existing.expulsado) {
      if (esPrimero) {
        existing.victoriasConsecutivasDesdeExpulsion++;
        if (existing.victoriasConsecutivasDesdeExpulsion >= 3) {
          existing.expulsado = false;
          existing.puntosTotales = 0;
          existing.victoriasConsecutivasDesdeExpulsion = 0;
          rehabilitado = true;
        }
      } else {
        existing.victoriasConsecutivasDesdeExpulsion = 0;
      }
    }

    if (!existing.expulsado && existing.puntosTotales <= -100) {
      existing.expulsado = true;
      existing.victoriasConsecutivasDesdeExpulsion = 0;
    }

    data.jugadores[nombre] = existing;
    rehabilitados.push({ nombre, rehabilitado });
  }

  setStorage(data);
  return rehabilitados;
}

export function savePartida(partida: PartidaRecord): void {
  const data = getStorage();
  data.historial.unshift(partida);
  if (data.historial.length > 20) data.historial = data.historial.slice(0, 20);
  setStorage(data);
}

export function getHistorial(): PartidaRecord[] {
  return getStorage().historial;
}

export function getAllPlayers(): { [nombre: string]: PlayerStorage } {
  return getStorage().jugadores;
}

export function getExpulsados(): string[] {
  const data = getStorage();
  return Object.entries(data.jugadores)
    .filter(([, p]) => p.expulsado)
    .map(([nombre]) => nombre);
}
