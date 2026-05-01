import { RondaRecord, Player } from './types';

export function generarAnalisis(
  historial: RondaRecord[],
  jugadores: Player[],
  ganadorId: string
): string {
  if (historial.length === 0) {
    return 'The history speaks. Next time, everyone will know a little more about how each player thinks.';
  }

  const ganador = jugadores.find(j => j.id === ganadorId);
  if (!ganador) {
    return 'The history speaks. Next time, everyone will know a little more about how each player thinks.';
  }

  const nombre = ganador.nombre;
  const numerosGanador = historial.map(
    r => r.numeros.find(n => n.jugadorId === ganadorId)?.valor ?? 0
  );

  const frecuencias = numerosGanador.reduce<Record<number, number>>((acc, n) => {
    acc[n] = (acc[n] ?? 0) + 1;
    return acc;
  }, {});

  if (Object.values(frecuencias).some(c => c >= 3)) {
    return `${nombre} showed a clear pattern. Next game, anyone who remembers can exploit it.`;
  }

  const cincos = numerosGanador.filter(n => n === 5).length;
  if (cincos > historial.length / 2) {
    return `${nombre} chose perfect defense. Not really trying to win — just survive.`;
  }

  const ejecutoPerfecto = historial.some(
    r => r.golpePerfecto && r.ganadores.includes(ganadorId)
  );
  if (ejecutoPerfecto) {
    return `${nombre} read the exact moment. A 1 and a 10 at the same table is the most extreme bet — and it worked.`;
  }

  const intento1 = numerosGanador.some(n => n === 1);
  if (intento1) {
    return `${nombre} went for the Perfect Strike and took the risk.`;
  }

  const umbralExacto = historial.some(r => r.suma === r.umbral);
  if (umbralExacto) {
    return 'One round landed exactly on the threshold. The table was on the edge.';
  }

  const totalDano = historial.reduce((sum, r) => {
    const d = r.danos.find(d => d.jugadorId === ganadorId);
    return sum + (d?.cantidad ?? 0);
  }, 0);
  if (totalDano === 0 && !ganador.eliminado) {
    return `${nombre} read every round without a single mistake. That is not luck.`;
  }

  return 'The history speaks. Next time, everyone will know a little more about how each player thinks.';
}
