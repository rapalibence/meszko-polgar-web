import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Vercel compiles api/* as ES modules file by file: extensionless relative imports fail at runtime.
describe('api ESM imports', () => {
  it('uses explicit .js extensions on relative imports reachable from api/', () => {
    for (const f of ['api/quote.ts', 'src/lib/quoteSchema.ts']) {
      const src = readFileSync(resolve(process.cwd(), f), 'utf8');
      const rel = [...src.matchAll(/from '(\.{1,2}\/[^']+)'/g)].map((m) => m[1]);
      for (const r of rel) expect(r, `${f}: ${r}`).toMatch(/\.js$/);
    }
  });
});
