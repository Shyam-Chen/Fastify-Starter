import { Cat } from './type';

export const CatsService = {
  cats: [] as Cat[],
  create(cat: Cat) {
    CatsService.cats.push(cat);
  },
  findAll(): Cat[] {
    return CatsService.cats;
  },
};
