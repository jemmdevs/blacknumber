import { RondaRecord, Player } from './types';

export function generarAnalisis(
  historial: RondaRecord[],
  jugadores: Player[],
  ganadorId: string
): string {
  if (historial.length === 0) {
    return 'El historial habla. La próxima vez, todos sabrán un poco más sobre cómo piensa cada uno.';
  }

  const ganador = jugadores.find(j => j.id === ganadorId);
  if (!ganador) {
    return 'El historial habla. La próxima vez, todos sabrán un poco más sobre cómo piensa cada uno.';
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
    return `${nombre} mostró un patrón claro. La próxima partida, cualquiera que lo recuerde puede explotarlo.`;
  }

  const cincos = numerosGanador.filter(n => n === 5).length;
  if (cincos > historial.length / 2) {
    return `${nombre} eligió la defensa perfecta. Nunca intentó ganar de verdad — solo sobrevivir.`;
  }

  const ejecutoPerfecto = historial.some(
    r => r.golpePerfecto && r.ganadores.includes(ganadorId)
  );
  if (ejecutoPerfecto) {
    return `${nombre} leyó el momento exacto. El 1 y el 10 en la misma mesa es la apuesta más extrema — y funcionó.`;
  }

  const intento1 = numerosGanador.some(n => n === 1);
  const perfectosEjecutados = historial.filter(
    r => r.golpePerfecto && r.ganadores.includes(ganadorId)
  ).length;
  if (intento1 && perfectosEjecutados === 0) {
    return `${nombre} apostó por el Golpe Perfecto y falló. El riesgo tiene un precio.`;
  }

  const umbralExacto = historial.some(r => r.suma === r.umbral);
  if (umbralExacto) {
    return `Una ronda tocó el límite exacto del umbral. La tensión no pudo ser mayor.`;
  }

  const totalDano = historial.reduce((sum, r) => {
    const d = r.danos.find(d => d.jugadorId === ganadorId);
    return sum + (d?.cantidad ?? 0);
  }, 0);
  if (totalDano === 0 && !ganador.eliminado) {
    return `${nombre} leyó cada ronda sin cometer un solo error. Eso no es suerte.`;
  }

  return 'El historial habla. La próxima vez, todos sabrán un poco más sobre cómo piensa cada uno.';
}
