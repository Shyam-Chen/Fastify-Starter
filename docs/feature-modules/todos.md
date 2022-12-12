<script lang="ts" setup>
import { reactive } from 'vue';

const flux = reactive({
  payload: {},
  tryItOut() {
    console.log(flux.payload);
  },
});
</script>

# Todos

Title:

<input v-model="flux.payload.title" class="border border-#42b883 px-2 py-1 rounded">

{{ flux.payload.title }}

<button class="border border-#42b883 px-2 py-1 rounded" @click="flux.tryItOut">Try it out</button>

## Design

Prototype

## Specification

### POST /api/todos

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

### POST /api/todos/new

```ts
export interface PayloadModel {
  title: string;
  completed?: boolean;
}

export interface ResponseModel {
  message: string;
}
```

### GET /api/todos/:id

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

### PUT /api/todos/:id

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

### DELETE /api/todos/:id

```ts
export interface ResponseModel {
  message: string;
}
```
