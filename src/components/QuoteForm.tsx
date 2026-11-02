import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { products } from '../content/products';
import { site } from '../content/site';
import { quoteSchema, type QuoteInput } from '../lib/quoteSchema';
import { cn } from '../lib/cn';
import { Button } from './ui/Button';

const f = site.contact.form;
const field = 'mt-2 h-12 w-full border border-hairline bg-bg px-3 text-ink placeholder:text-stone focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2';
const label = 'block text-[14px] font-medium text-ink/90';

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} role="alert" className="mt-1 text-[13px] text-accent">{msg}</p> : null;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { company: '', quantityT: '', address: '', note: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setStatus('success'); navigate('/koszonjuk'); return; }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  });

  if (status === 'success') {
    return (
      <div role="status" className="border border-hairline bg-bg-raised p-8">
        <p className="text-2xl font-semibold text-ink">{f.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-hairline bg-bg-raised p-6 md:p-8" aria-describedby={status === 'error' ? 'form-error' : undefined}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>{f.name} *</label>
          <input id="name" autoComplete="name" className={cn(field, errors.name && 'border-accent')} aria-invalid={!!errors.name} aria-describedby="name-err" {...register('name')} />
          <Err id="name-err" msg={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="company" className={label}>{f.company}</label>
          <input id="company" autoComplete="organization" maxLength={120} className={cn(field, errors.company && 'border-accent')} aria-invalid={!!errors.company} aria-describedby="company-err" {...register('company')} />
          <Err id="company-err" msg={errors.company?.message} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>{f.phone} *</label>
          <input id="phone" type="tel" autoComplete="tel" placeholder="+36 30 123 4567" className={cn(field, errors.phone && 'border-accent')} aria-invalid={!!errors.phone} aria-describedby="phone-err" {...register('phone')} />
          <Err id="phone-err" msg={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="email" className={label}>{f.email} *</label>
          <input id="email" type="email" autoComplete="email" className={cn(field, errors.email && 'border-accent')} aria-invalid={!!errors.email} aria-describedby="email-err" {...register('email')} />
          <Err id="email-err" msg={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="product" className={label}>{f.product} *</label>
          <select id="product" className={cn(field, 'appearance-none bg-no-repeat bg-[right_12px_center] bg-[length:12px_12px] pr-9', errors.product && 'border-accent')} style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' fill='none' stroke='%23A9A295' stroke-width='1.5'/></svg>\")" }} aria-invalid={!!errors.product} aria-describedby="product-err" defaultValue="" {...register('product')}>
            <option value="" disabled>{f.productPlaceholder}</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            <option value="egyeb">{f.productOther}</option>
          </select>
          <Err id="product-err" msg={errors.product?.message} />
        </div>
        <div>
          <label htmlFor="quantityT" className={label}>{f.quantity}</label>
          <input id="quantityT" type="number" min={1} inputMode="numeric" className={cn(field, errors.quantityT && 'border-accent')} aria-invalid={!!errors.quantityT} aria-describedby="quantity-err" {...register('quantityT')} />
          <Err id="quantity-err" msg={errors.quantityT?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={label}>{f.address}</label>
          <input id="address" autoComplete="street-address" maxLength={200} className={cn(field, errors.address && 'border-accent')} aria-invalid={!!errors.address} aria-describedby="address-err" {...register('address')} />
          <Err id="address-err" msg={errors.address?.message} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="note" className={label}>{f.note}</label>
          <textarea id="note" rows={4} maxLength={1000} className={cn(field, 'h-auto py-3', errors.note && 'border-accent')} aria-invalid={!!errors.note} aria-describedby="note-err" {...register('note')} />
          <Err id="note-err" msg={errors.note?.message} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-[15px] text-ink/90">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" aria-invalid={!!errors.consent} aria-describedby="consent-err" {...register('consent')} />
            <span>
              {f.consent.replace('az adatkezelési tájékoztatót', '')}
              <a href="/adatkezeles" target="_blank" rel="noopener" className="underline underline-offset-4 text-ink">az adatkezelési tájékoztatót</a> *
            </span>
          </label>
          <Err id="consent-err" msg={errors.consent?.message} />
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'submitting'} data-cta-button>
          {status === 'submitting' ? f.submitting : site.cta}
        </Button>
        {status === 'error' && <p id="form-error" role="alert" className="text-[14px] text-accent">{f.failure}</p>}
      </div>
    </form>
  );
}
