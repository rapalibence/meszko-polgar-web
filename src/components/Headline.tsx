import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';

type Props = { text: string; mark?: string; as?: ElementType; className?: string; children?: ReactNode };

/** Display headline with one highlighted phrase; words rise in via [data-split]. */
export function Headline({ text, mark, as: Tag = 'h2', className }: Props) {
  const i = mark ? text.indexOf(mark) : -1;
  return (
    <Tag data-split className={cn('font-display font-bold uppercase leading-[0.9] tracking-[-0.01em] text-balance', className)}>
      {i < 0 ? text : (
        <>
          {text.slice(0, i)}<mark className="hl">{mark}</mark>{text.slice(i + mark!.length)}
        </>
      )}
    </Tag>
  );
}
