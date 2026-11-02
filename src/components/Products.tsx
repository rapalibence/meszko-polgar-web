import { motion } from 'framer-motion';
import { products } from '../content/products';
import { site } from '../content/site';
import { stagger } from '../lib/motion';
import { Photo } from './Photo';
import { cn } from '../lib/cn';

/** Uneven mosaic: lg 7/12 x 2 rows; md tiles 3/2/2/3; sm fills. */
const layout: Record<string, string> = {
  lg: 'md:col-span-7 md:row-span-2',
  md: 'md:col-span-5',
  sm: 'md:col-span-5',
};
const mdSplit = ['md:col-span-3', 'md:col-span-2', 'md:col-span-2', 'md:col-span-3'];

export function Products() {
  let mdIndex = 0;
  return (
    <section id="termekek" className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <motion.h2 {...stagger(0)} className="text-5xl md:text-6xl text-ink text-balance">{site.products.h2}</motion.h2>
        <motion.p {...stagger(1)} className="mt-5 max-w-[60ch] text-stone">{site.products.intro}</motion.p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-flow-dense">
          {products.map((p, i) => {
            const span = p.span === 'md' ? mdSplit[mdIndex++ % mdSplit.length] : layout[p.span];
            const ratio = p.span === 'lg' ? { w: 960, h: 720 } : { w: 960, h: 720 };
            const sizes = p.span === 'lg' ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 768px) 22vw, 100vw';
            return (
              <motion.article
                key={p.slug}
                data-product
                data-span={p.span}
                {...stagger(i)}
                className={cn('group flex flex-col border-t border-hairline pt-4', span)}
              >
                <Photo src={p.photo} w={ratio.w} h={ratio.h} alt={`${p.name}, ${p.range}`} sizes={sizes} className={p.span === 'lg' ? 'aspect-[6/5] md:h-full' : 'aspect-[4/3]'} />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-ink">{p.name}</h3>
                  <span className="font-mono text-[13px] text-stone whitespace-nowrap">{p.range}</span>
                </div>
                <p className="mt-1 text-[15px] text-stone">{p.use}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.p {...stagger(0)} className="mt-12 max-w-[70ch] text-[15px] text-stone">{site.products.outro}</motion.p>
      </div>
    </section>
  );
}
