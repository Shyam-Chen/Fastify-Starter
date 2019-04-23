function Environments() {
  this.NODE_ENV = process.env.NODE_ENV || 'development';

  this.HOST_NAME = process.env.HOST_NAME || '0.0.0.0';
  this.SITE_PORT = process.env.SITE_PORT || 3000;

  this.SECRET = process.env.SECRET || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu';
}

module.exports = new Environments();
