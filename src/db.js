import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    user: 'testuser',
    host: '192.168.0.109',
    database: 'testdb',
    password: '12345',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
    } else {
      console.log('Подключение к базе данных успешно');
    }
    release();
  });
export default pool;
