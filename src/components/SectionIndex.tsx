/** Cominvi-style section index: mono number and a plain label, one hairline below. */
export function SectionIndex({ n, label, dark }: { n: string; label: string; dark?: boolean }) {
  return (
    <div className={`flex items-baseline gap-4 border-b pb-4 ${dark ? 'border-dark-hairline' : 'border-hairline'}`}>
      <span className={`font-mono text-[12px] tabular-nums ${dark ? 'text-dark-ink/60' : 'text-stone'}`}>{n}</span>
      <span className={`text-[15px] ${dark ? 'text-dark-ink/80' : 'text-ink/80'}`}>{label}</span>
    </div>
  );
}
