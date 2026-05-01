'use client';

interface RulesOverlayProps {
  onClose: () => void;
}

export default function RulesOverlay({ onClose }: RulesOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg-primary)]">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <h2 className="text-xs font-medium tracking-[0.2em] uppercase">Rules</h2>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center bg-black font-mono-game text-sm text-white"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto max-w-lg space-y-8">

          <section className="space-y-2">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Overview</h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              Blacknumbers is a psychological strategy game for 2–5 players. Each round,
              every player secretly picks a number. Once all players have chosen, the
              numbers are revealed simultaneously and damage is dealt.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Threshold</h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              Each round has a Threshold = N × ⌊range max / 2⌋, where N is the number of active players.
            </p>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex gap-3">
                <span className="text-neutral-400">&mdash;</span>
                <span>Sum ≤ Threshold → <strong>HIGH</strong> world: highest number wins</span>
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">&mdash;</span>
                <span>Sum &gt; Threshold → <strong>LOW</strong> world: lowest number wins</span>
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">&mdash;</span>
                <span>Winner takes no damage. Each loser takes damage = |their number − winning number|</span>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Perfect Strike</h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              If the world is LOW, the winning number is 1, and any player played 10 —
              that player takes <strong>double damage</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">HP &amp; Elimination</h3>
            <div className="overflow-hidden border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-2 text-left font-normal text-neutral-500">Players</th>
                    <th className="px-4 py-2 text-left font-normal text-neutral-500">Starting HP</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    [2, 10],
                    [3, 12],
                    [4, 15],
                    [5, 18],
                  ] as [number, number][]).map(([p, hp]) => (
                    <tr key={p} className="border-b border-neutral-100 last:border-0">
                      <td className="px-4 py-2 tabular-nums">{p}</td>
                      <td className="px-4 py-2 tabular-nums">{hp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-700">
              A player is eliminated when their HP reaches 0. The game ends when only one
              player survives or all 5 rounds are completed — the player with the most HP wins.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Modes</h3>
            <div className="space-y-2">
              <div className="border border-neutral-200 px-4 py-3">
                <p className="text-sm font-medium tracking-wide">Classic</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Fixed range 1–10. Threshold = N × 5. 5 rounds.
                </p>
              </div>
              <div className="border border-neutral-200 px-4 py-3">
                <p className="text-sm font-medium tracking-wide">Escalation</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Range grows each round: 4 / 6 / 8 / 10 / 12.
                  Threshold is recalculated every round.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] tracking-[0.22em] text-neutral-500 uppercase">Hotseat</h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              Each player picks their number in secret, then passes the phone to the next player.
              Look away when it is not your turn. Numbers are only revealed once everyone has confirmed.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
