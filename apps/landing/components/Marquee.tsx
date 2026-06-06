const ITEMS = [
  "104 jogos cobertos",
  "histórico 100% público",
  "leitura por IA em segundos",
  "acertos e erros à mostra",
  "sem achismo",
];

export function Marquee() {
  // duplicado para o loop contínuo (translateX -50%)
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {loop.map((item, i) => (
          <span key={i}>
            {item}
            <span />
          </span>
        ))}
      </div>
    </div>
  );
}
