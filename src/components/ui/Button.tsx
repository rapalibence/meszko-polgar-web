import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';

const base =
  'inline-flex items-center justify-center text-[15px] font-semibold ' +
  'h-12 px-6 rounded-none select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-accent-deep text-dark-ink hover:bg-accent',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-dark-ink',
  ghost: 'border border-dark-ink/60 text-dark-ink hover:bg-dark-ink hover:text-ink',
};

export function buttonClass(variant: Variant = 'primary', extra?: string) {
  return cn(base, variants[variant], extra);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...rest} />;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant };
export function ButtonLink({ variant = 'primary', className, ...rest }: LinkProps) {
  return <a className={buttonClass(variant, className)} {...rest} />;
}
