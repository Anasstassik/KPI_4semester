# Трекер лабораторних робіт (Lab Tracker API)

## Інструкція із запуску
1. Встановіть залежності: `npm install`
2. Створіть файл `.env` та додайте `DATABASE_URL="file:./dev.db"`
3. Запустіть міграції БД: `npx prisma migrate dev --name init`
4. Запустіть сервер: `npm run dev`

## Тестування
Для запуску unit та integration тестів виконайте команду: `npm test`