# Todos

## POST /api/todos

```ts
export interface PayloadModel {
  title?: string;
  completed?: boolean;
  field?: string;
  order?: 'asc' | 'desc';
  page?: number | string;
  rows?: number | string;
}

export interface ResponseModel {
  message: string;
  result: Array<{
    _id?: string;
    title?: string;
    completed?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }>;
  total: number;
}
```

## POST /api/todos/:id=new

```ts
export interface PayloadModel {
  title: string;
  completed?: boolean;
}

export interface ResponseModel {
  message: string;
}
```

## GET /api/todos/:id

```ts
export interface ResponseModel {
  message: string;
  result: {
    _id?: string;
    title?: string;
    completed?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}
```

## PUT /api/todos/:id

```ts
export interface PayloadModel {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseModel {
  message: string;
}
```

## DELETE /api/todos/:id

```ts
export interface ResponseModel {
  message: string;
}
```
