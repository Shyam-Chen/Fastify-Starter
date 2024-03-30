import path from 'node:path';
import * as docker from '@pulumi/docker';
import * as pulumi from '@pulumi/pulumi';

const currentStack = pulumi.getStack();

const mongoDataVolume = new docker.Volume('mongo-data');

const mongoContainer = new docker.Container('local-mongo', {
  image: 'mongo:7',
  restart: 'always',
  envs: [
    'MONGO_INITDB_ROOT_USERNAME=root',
    'MONGO_INITDB_ROOT_PASSWORD=rootpasswd',
    'MONGO_INITDB_DATABASE=mydb',
  ],
  ports: [{ internal: 27017, external: 27017 }],
  volumes: [
    {
      volumeName: mongoDataVolume.name,
      containerPath: '/data',
    },
    {
      hostPath: path.resolve(__dirname, '../../db'),
      containerPath: '/docker-entrypoint-initdb.d',
      readOnly: true,
    },
  ],
});

const redisDataVolume = new docker.Volume('redis-data');

const redisContainer = new docker.Container('local-redis', {
  image: 'redis:alpine',
  restart: 'always',
  command: ['redis-server', '--save', '60', '1', '--loglevel', 'warning'],
  ports: [{ internal: 6379, external: 6379 }],
  volumes: [{ volumeName: redisDataVolume.name, containerPath: '/data' }],
});

export = async () => {
  if (currentStack === 'local') {
    return {
      mongoContainerName: mongoContainer.name,
      redisContainerName: redisContainer.name,
    };
  }

  return {};
};
