import express from 'express';
import db from './db.js';

/*
fetch('http://localhost:3000/courses', { method: 'post', body: JSON.stringify({ title: 'dba' }),
    headers:
        { 'content-type': 'application/json'
    }})
        .then((res) => res.json())
        .then((json) => console.log(json));

        const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'devops' },
        { id: 4, title: 'automation qa' },
    ]
};
 let foundCourses = db.courses;
     if(req.query.title) {
       foundCourses = db.courses.filter((cours) => cours.title.indexOf(req.query.title) > -1);
     }
*/

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

app.get('/user', (req, res) => {
    res.json({ data: 'Hello user!!!!!!' });
  });

  app.get('/courses',async (req, res) => {
    const foundCoursers = await db.query(`SELECT * FROM courses`)
        res.json(foundCourses);
  });

  app.get('/courses/:id', (req, res) => {
    const curentCours = db.courses.find((cours) => cours.id === +req.params.id);
    if (!curentCours) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(curentCours);
  });

  app.post('/courses', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
    };
    
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(db.courses);
  });

  app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const curentCours = db.courses.find((cours) => cours.id === +req.params.id);
    if (!curentCours) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    curentCours.title = req.body.title;
    res.json(curentCours);
  });

  app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter((cours) => cours.id !== +req.params.id);
        //res.status(204).json(db.courses);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
