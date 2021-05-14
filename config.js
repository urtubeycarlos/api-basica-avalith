require('dotenv').config();

const config = {
  test: {
    db: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'university-test',
    },
    auth: {
      expire: '1000',
      algorithm: 'HS256', // HS256
      privateKey: 'U-V&Qw;4,d^jbjN',
      passphrase: 'pu(HHND/E-mK//2',
    },
  },
  dev: {
    db: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'university',
    },
    auth: {
      expire: '1h',
      algorithm: 'HS256', // HS256
      privateKey: 'U-V&Qw;4,d^jbjN',
      passphrase: 'pu(HHND/E-mK//2',
    },
  },
};
module.exports = config[process.env.NODE_ENV || 'dev'];
