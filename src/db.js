import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    user: 'testuser',
    host: '127.0.0.1',
    database: 'testdb',
    password: 'root',
    port: '12345',
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
