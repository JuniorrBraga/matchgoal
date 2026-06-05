import type { GroupStanding } from "@matchgoal/shared";

/** Tabela de classificação de um grupo (estilo enxuto). */
export function StandingsTable({ standing }: { standing: GroupStanding }) {
  const letter = standing.group.replace("Grupo ", "");
  return (
    <article className="card gtable">
      <h3 className="gtable__name">
        <span className="pill">{letter}</span>
        {standing.group}
      </h3>
      <table className="standings">
        <thead>
          <tr>
            <th>Seleção</th>
            <th className="num">J</th>
            <th className="num">SG</th>
            <th className="num">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standing.rows.map((r) => (
            <tr key={r.code}>
              <td>
                <span className="team">
                  <span className="flag">{r.flag}</span>
                  {r.name}
                </span>
              </td>
              <td className="num">{r.played}</td>
              <td className="num">{r.goalsFor - r.goalsAgainst}</td>
              <td className="num pts">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
