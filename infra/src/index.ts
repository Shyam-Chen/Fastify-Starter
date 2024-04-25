import * as pulumi from '@pulumi/pulumi';

import * as local from './local';

const currentStack = pulumi.getStack();

export = async () => {
  if (currentStack === 'local') {
    return {
      mongoContainerName: local.mongoContainer.name,
      redisContainerName: local.redisContainer.name,
    };
  }

  if (currentStack === 'ci') {
    return {};
  }

  if (['dev', 'test', 'prod'].includes(currentStack)) {
    return {};
  }

  return {};
};
