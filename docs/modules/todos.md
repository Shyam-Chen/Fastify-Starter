# Todos

## POST /api/todos

```sh
curl --request POST \
     --url http://127.0.0.1:3000/api/todos \
     --header 'Content-Type: application/json' \
     --data '{}'
```

```sh
curl --request POST \
     --url http://127.0.0.1:3000/api/todos \
     --header 'Content-Type: application/json' \
     --data '{ "title": "Vue" }'
```

```sh
curl --request POST \
     --url http://127.0.0.1:3000/api/todos \
     --header 'Content-Type: application/json' \
     --data '{ "page": 2 }'
```

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

```sh
curl --request POST \
     --url http://127.0.0.1:3000/api/todos/new \
     --header 'Content-Type: application/json' \
     --data '{ "title": "foo" }'
```

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

```sh
curl --request GET \
     --url http://127.0.0.1:3000/api/todos/634787af6d44cfba9c0df8ea
```

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

```sh
curl --request PUT \
     --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1 \
     --header 'Content-Type: application/json' \
     --data '{
       "title": "foo",
       "completed": true
     }'
```

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

```sh
curl --request DELETE \
     --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1
```

```ts
export interface ResponseModel {
  message: string;
}
```
