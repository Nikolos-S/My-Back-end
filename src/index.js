import express from 'express';
import db from './db.js';

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

const app = express();
const port = 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

  app.get('/users', async (req, res) => {
    try {
      let foundUsers = await db.query(`SELECT * FROM users`)
     if(req.query.name) {
      foundUsers.rows = foundUsers.rows.filter((user) => user.name.toLowerCase().indexOf(req.query.name.toLowerCase()) > -1);
     }
        res.json(foundUsers.rows);
    } catch (error) {
      console.error('Ошибка запроса:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const userId = +req.params.id;
    try {
      const curentUser = await db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
      if (curentUser.rows.length > 0) {
        res.json(curentUser.rows[0]);
      } else {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({error: 'пользователь не найден' });
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  });

  app.post('/users', async (req, res) => {
    const { name } = req.body;
    try {
      if (!name) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const newUser = await db.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
      res.status(HTTP_STATUSES.CREATED_201).json(newUser.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Произошла ошибка при добавлении пользователя' });
    };
  });

  app.put('/users/:id', async (req, res) => {
    const { name } = req.body;
     const { id } = req.params;

     try {
      if (!name) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const updateUser = await db.query('UPDATE users SET name = $1 WHERE user_id = $2 RETURNING *', [name, id]);
    if (!updateUser) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: 'Пользователь не найден' });
        return;
    }
    res.json(updateUser.rows);
     } catch (error) {
      console.error('Ошибка запроса:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  });

  app.delete('/users/:id', async (req, res) => {
        const { id } = req.params;
        try {
          await db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
          res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } catch (error) {
          console.error('Ошибка удаления пользователя:', error);
          res.status(500).json({ error: 'Произошла ошибка при удалении пользователя' });
        }
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
