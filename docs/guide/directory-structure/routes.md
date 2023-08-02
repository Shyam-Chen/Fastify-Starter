# Routes Directory

Defines a file-based routing to create routes with Domain-driven Design.

## Usage

```coffee
src/routes/auth/signup/+handler.ts -> /auth/signup
src/routes/auth/login/+handler.ts -> /auth/login

src/routes/products/+handler.ts -> /products
src/routes/products/[id]/+handler.ts -> /products/:id
```
