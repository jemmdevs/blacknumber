import { GameMode, RondaConfig, Player, RondaRecord, FinPartidaResult } from './types';

export const HP_CONFIG: Record<number, number> = { 2: 10, 3: 12, 4: 15, 5: 18 };

export function calcularUmbral(nJugadores: number, rangoMax: number): number {
  return nJugadores * Math.floor(rangoMax / 2);
}

export function calcularRondaConfig(modo: GameMode, ronda: number, nJugadores: number): RondaConfig {
  if (modo === 'clasico') {
    return { numero: ronda, rangoMin: 1, rangoMax: 10, umbral: calcularUmbral(nJugadores, 10) };
  }
  const rangos = [4, 6, 8, 10, 12];
  const rangoMax = rangos[Math.min(ronda - 1, 4)];
  return { numero: ronda, rangoMin: 1, rangoMax, umbral: calcularUmbral(nJugadores, rangoMax) };
}

export function resolverRonda(
  numeros: { jugadorId: string; valor: number }[],
  config: RondaConfig
): RondaRecord {
  const suma = numeros.reduce((s, n) => s + n.valor, 0);
  const mundo: 'alto' | 'bajo' = suma <= config.umbral ? 'alto' : 'bajo';

  const valorGanador =
    mundo === 'alto'
      ? Math.max(...numeros.map(n => n.valor))
      : Math.min(...numeros.map(n => n.valor));

  const ganadores = numeros.filter(n => n.valor === valorGanador).map(n => n.jugadorId);

  let golpePerfecto = false;
  let jugadorGolpeado: string | undefined;
  if (mundo === 'bajo' && valorGanador === 1) {
    const con10 = numeros.find(n => n.valor === 10);
    if (con10) {
      golpePerfecto = true;
      jugadorGolpeado = con10.jugadorId;
    }
  }

  const danos = numeros.map(n => {
    if (ganadores.includes(n.jugadorId)) return { jugadorId: n.jugadorId, cantidad: 0 };
    const base = Math.abs(n.valor - valorGanador);
    if (golpePerfecto && n.jugadorId === jugadorGolpeado) {
      return { jugadorId: n.jugadorId, cantidad: base * 2 };
    }
    return { jugadorId: n.jugadorId, cantidad: base };
  });

  return {
    ronda: config.numero,
    numeros,
    suma,
    umbral: config.umbral,
    mundo,
    valorGanador,
    ganadores,
    danos,
    golpePerfecto,
    jugadorGolpeado,
  };
}

export function aplicarDanos(jugadores: Player[], ronda: RondaRecord): Player[] {
  return jugadores.map(j => {
    if (j.eliminado) return j;
    const dano = ronda.danos.find(d => d.jugadorId === j.id);
    if (!dano) return j;
    const newHp = Math.max(0, j.hp - dano.cantidad);
    return { ...j, hp: newHp, eliminado: newHp <= 0 };
  });
}

function buildClasificacion(
  jugadores: Player[]
): { jugadorId: string; hp: number; puesto: number }[] {
  const sorted = [...jugadores].sort((a, b) => b.hp - a.hp);
  let puesto = 1;
  return sorted.map((j, i) => {
    if (i > 0 && j.hp < sorted[i - 1].hp) puesto = i + 1;
    return { jugadorId: j.id, hp: j.hp, puesto };
  });
}

export function verificarFinPartida(
  jugadores: Player[],
  rondaActual: number,
  totalRondas: number
): FinPartidaResult | null {
  const vivos = jugadores.filter(j => !j.eliminado);

  if (vivos.length <= 1) {
    return {
      ganadores: vivos.map(j => j.id),
      clasificacion: buildClasificacion(jugadores),
    };
  }

  if (rondaActual >= totalRondas) {
    const maxHp = Math.max(...vivos.map(j => j.hp));
    return {
      ganadores: vivos.filter(j => j.hp === maxHp).map(j => j.id),
      clasificacion: buildClasificacion(jugadores),
    };
  }

  return null;
}

export function calcularPuntosClase(
  clasificacion: { jugadorId: string; hp: number; puesto: number }[],
  jugadores: Player[],
  historial: RondaRecord[],
  modo: GameMode
): { jugadorId: string; puntos: number }[] {
  const n = jugadores.length;
  const lastPuesto = Math.max(...clasificacion.map(c => c.puesto));

  return clasificacion.map(c => {
    let puntos = 0;

    if (c.puesto === 1) {
      const empates = clasificacion.filter(x => x.puesto === 1).length;
      puntos += Math.floor(50 / empates);
    } else if (c.puesto === 2 && n >= 3) {
      puntos += 20;
    } else if (c.puesto === 3 && n >= 4) {
      puntos += 10;
    } else if (c.puesto === 4 && n >= 5) {
      puntos += 5;
    }

    if (c.puesto === lastPuesto) puntos -= 30;

    const totalDano = historial.reduce((sum, r) => {
      const d = r.danos.find(d => d.jugadorId === c.jugadorId);
      return sum + (d?.cantidad ?? 0);
    }, 0);
    const j = jugadores.find(p => p.id === c.jugadorId);
    if (totalDano === 0 && j && !j.eliminado) puntos += 25;

    const ejecutoPerfecto = historial.some(
      r => r.golpePerfecto && r.ganadores.includes(c.jugadorId)
    );
    if (ejecutoPerfecto) puntos += 30;

    if (modo === 'escalada' && c.puesto === 1) puntos += 20;

    return { jugadorId: c.jugadorId, puntos };
  });
}
