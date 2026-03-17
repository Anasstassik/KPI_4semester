const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-lab';
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Неавторизований запит' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Недійсний токен' });
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email вже використовується' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });

    res.status(201).json({ message: 'Створено', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Неправильний email або пароль' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.post('/api/disciplines', authenticateToken, async (req, res) => {
  if (req.user.role !== 'TEACHER') {
    return res.status(403).json({ error: 'Тільки викладач може створювати дисципліни' });
  }

  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Назва обов\'язкова' });

    const existing = await prisma.discipline.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: 'Така дисципліна вже існує' });
    }

    const discipline = await prisma.discipline.create({ data: { name } });
    res.status(201).json(discipline);
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/disciplines', authenticateToken, async (req, res) => {
  const disciplines = await prisma.discipline.findMany();
  res.json(disciplines);
});

app.post('/api/labs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'TEACHER') {
    return res.status(403).json({ error: 'Доступ заборонено. Тільки викладач створює лаби.' });
  }

  try {
    const { title, description, deadline, disciplineId } = req.body;

    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      return res.status(400).json({ error: 'Помилка: дедлайн не може бути в минулому' });
    }

    const lab = await prisma.labWork.create({
      data: { 
        title, 
        description, 
        deadline: deadlineDate, 
        disciplineId: parseInt(disciplineId) 
      }
    });
    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ error: 'Помилка при створенні лаби' });
  }
});

app.patch('/api/labs/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['До виконання', 'На перевірці', 'Здано'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Некоректний статус' });
  }

  try {
    const updatedLab = await prisma.labWork.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(updatedLab);
  } catch (error) {
    res.status(404).json({ error: 'Лабораторну роботу не знайдено' });
  }
});

app.get('/api/labs', authenticateToken, async (req, res) => {
  try {
    const labs = await prisma.labWork.findMany({
      include: { discipline: true },
      orderBy: { deadline: 'asc' } 
    });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання списку' });
  }
});


module.exports = { app, authenticateToken };

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
}