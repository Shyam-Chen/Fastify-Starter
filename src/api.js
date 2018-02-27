import express from 'express';

import { PORT } from './env';

const app = express();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`);
});

export default app;
