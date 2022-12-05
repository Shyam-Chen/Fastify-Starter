# Modules Directory

Defines a folder-based routing to create routes with Domain-driven Design.

## Usage

```coffee
src/modules/auth/signup/registry.ts -> /auth/signup
src/modules/auth/login/registry.ts -> /auth/login

src/modules/products/registry.ts -> /products
src/modules/products/new/registry.ts -> /products/new
src/modules/products/[id]/registry.ts -> /products/:id
```

Specify Files:

```ts
// src/plugins/router.ts
app.register(import('~/modules/auth/signup/registry'), { prefix: prefix + '/auth/signup' });
app.register(import('~/modules/auth/login/registry'), { prefix: prefix + '/auth/login' });

app.register(import('~/modules/products/registry'), { prefix: prefix + '/products' });
app.register(import('~/modules/products/new/registry'), { prefix: prefix + '/products/new' });
app.register(import('~/modules/products/[id]/registry'), { prefix: prefix + '/products/:id' });
```

Module Groups:

```ts
// src/plugins/router.ts
import authRoutes from '~/modules/auth/routes';

app.register(authRoutes, { prefix });
```

```ts
// src/modules/auth/routes.ts
import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.register(import('./signup/registry'), { prefix: '/auth/signup' });
  app.register(import('./login/registry'), { prefix: '/auth/login' });
};
```
