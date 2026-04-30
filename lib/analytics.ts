import { RondaRecord, Player } from './types';

export function generarAnalisis(
  historial: RondaRecord[],
  jugadores: Player[],
  ganadorId: string
): string {
  if (historial.length === 0) {
    return 'El historial habla. La proxima vez, todos sabran un poco mas sobre como piensa cada uno.';
  }

  const ganador = jugadores.find(j => j.id === ganadorId);
  if (!ganador) {
    return 'El historial habla. La proxima vez, todos sabran un poco mas sobre como piensa cada uno.';
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
    return `${nombre} mostro un patron claro. La proxima partida, cualquiera que lo recuerde puede explotarlo.`;
  }

  const cincos = numerosGanador.filter(n => n === 5).length;
  if (cincos > historial.length / 2) {
    return `${nombre} eligio la defensa perfecta. No intento ganar de verdad: solo sobrevivir.`;
  }

  const ejecutoPerfecto = historial.some(
    r => r.golpePerfecto && r.ganadores.includes(ganadorId)
  );
  if (ejecutoPerfecto) {
    return `${nombre} leyo el momento exacto. El 1 y el 10 en la misma mesa es la apuesta mas extrema, y funciono.`;
  }

  const intento1 = numerosGanador.some(n => n === 1);
  if (intento1) {
    return `${nombre} aposto por el Golpe Perfecto y asumio el riesgo.`;
  }

  const umbralExacto = historial.some(r => r.suma === r.umbral);
  if (umbralExacto) {
    return 'Una ronda toco el limite exacto del umbral. La mesa estuvo al filo.';
  }

  const totalDano = historial.reduce((sum, r) => {
    const d = r.danos.find(d => d.jugadorId === ganadorId);
    return sum + (d?.cantidad ?? 0);
  }, 0);
  if (totalDano === 0 && !ganador.eliminado) {
    return `${nombre} leyo cada ronda sin cometer un solo error. Eso no es suerte.`;
  }

  return 'El historial habla. La proxima vez, todos sabran un poco mas sobre como piensa cada uno.';
}
