import type { FastifyInstance } from 'fastify';
import { Type, Static } from '@sinclair/typebox';

// import auth from '~/middleware/auth';
import CollectionData from '~/components/CollectionData';
import CrudOperations from '~/components/CrudOperations';

export default async (app: FastifyInstance) => {
  const body = Type.Object({
    Players: Type.String(),
    GP: Type.Number(),
    MIN: Type.Number(),
    PTS: Type.Number(),
    FGM: Type.Number(),
    FGA: Type.Number(),
    FG_PCT: Type.Number(),
    FG3M: Type.Number(),
    FG3A: Type.Number(),
    FG3_PCT: Type.Number(),
    FTM: Type.Number(),
    FTA: Type.Number(),
    FT_PCT: Type.Number(),
    OREB: Type.Number(),
    DREB: Type.Number(),
    REB: Type.Number(),
    AST: Type.Number(),
    TOV: Type.Number(),
    STL: Type.Number(),
    BLK: Type.Number(),
    PF: Type.Number(),
    PLUS_MINUS: Type.Number(),
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auto-use/feat-foo \
    --header 'content-type: application/json' \
    --data '{}' | json_pp

  curl --request POST \
    --url http://127.0.0.1:3000/api/auto-use/feat-foo \
    --header 'content-type: application/json' \
    --data '{ "GP_GTE": 12, "GP_LTE": 14  }' | json_pp

  curl --request POST \
    --url http://127.0.0.1:3000/api/auto-use/feat-foo \
    --header 'content-type: application/json' \
    --data '{ "order": "asc" }' | json_pp
  */

  CollectionData(app, {
    collection: 'feat-foo',
    body,
    queryConditions(_body: Static<typeof body> & { GP_GTE?: number; GP_LTE?: number }) {
      const { Players, GP_GTE, GP_LTE } = _body;

      return {
        ...(Players && { Players: { $regex: Players, $options: 'i' } }),
        ...(GP_GTE && { GP: { $gte: GP_GTE } }),
        ...(GP_LTE && { GP: { $lte: GP_LTE } }),
        ...(GP_GTE && GP_LTE && { GP: { $gte: GP_GTE, $lte: GP_LTE } }),
      };
    },
    // options: {
    //   onRequest: [auth],
    // },
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auto-use/feat-foo/new \
    --header 'content-type: application/json' \
    --data '{
      "Players": "Alex Caruso",
      "GP": 18,
      "MIN": 25.5,
      "PTS": 5.1,
      "FGM": 1.7,
      "FGA": 4.3,
      "FG_PCT": 39.0,
      "FG3M": 0.9,
      "FG3A": 2.5,
      "FG3_PCT": 35.6,
      "FTM": 0.8,
      "FTA": 1.1,
      "FT_PCT": 75.0,
      "OREB": 0.5,
      "DREB": 2.3,
      "REB": 2.8,
      "AST": 3.7,
      "TOV": 1.6,
      "STL": 1.6,
      "BLK": 0.8,
      "PF": 2.3,
      "PLUS_MINUS": 4.2
    }'
  */

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/auto-use/feat-foo/638026f014fabb48e0cd1242 | json_pp
  */

  CrudOperations(app, {
    collection: 'feat-foo',
    body,
  });
};
