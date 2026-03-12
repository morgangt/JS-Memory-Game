# 🎮 Memory Game - Telegram Mini App

Классическая игра на запоминание пар карточек, адаптированная для Telegram Mini Apps. Игроку нужно найти все пары карточек за ограниченное время.

![Memory Game](https://img.shields.io/badge/Platform-Telegram%20Mini%20App-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![License](https://img.shields.io/badge/License-MIT-green)


## 🎯 Особенности

- **3 уровня сложности:**
  - 🟢 **EASY** — 3 пары (6 карт), 30 секунд
  - 🟡 **NORMAL** — 6 пар (12 карт), 45 секунд
  - 🔴 **HARD** — 10 пар (20 карт), 60 секунд

- **Анимации:**
  - 🔄 Плавный 3D переворот карточек
  - 📳 Дрожание экрана при несовпадении
  - ✨ Эффект совпадения пар
  - 🎉 Конфетти при победе

- **Геймплей:**
  - ⏱️ Обратный отсчёт с цветовой индикацией
  - 👆 Счётчик ходов
  - 🏆 Сохранение рекордов в localStorage
  - 📊 Экран результатов с показателями

- **Telegram интеграция:**
  - Адаптация под тему Telegram
  - Поддержка Back Button
  - Безопасные зоны для устройств с "чёлкой"

## 🛠️ Технологии

| Технология | Описание |
|------------|----------|
| HTML5 | Семантическая разметка |
| CSS3 | Анимации, Flexbox, CSS Variables |
| JavaScript ES6+ | Игровая логика без фреймворков |
| Material Icons | Иконки Google |
| Telegram WebApp SDK | Интеграция с Telegram |
| Jest | Unit тестирование |

## 📋 Требования

- Node.js 16+ (для локального сервера и тестов)
- Современный браузер с поддержкой ES6+
- Telegram Desktop/Mobile (для Mini App)

## 🚀 Быстрый старт

### 1. Клонирование проекта

```bash
cd /home/z/my-project/download/memory-game
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск локального сервера

```bash
npm start
```

Сервер запустится на `http://localhost:3000`

### 4. Открыть в браузере

Перейдите по адресу: [http://localhost:3000](http://localhost:3000)

## 🧪 Тестирование

### Запуск всех тестов

```bash
npm test
```

### Запуск тестов с отчётом покрытия

```bash
npm test -- --coverage
```

### Watch-режим для разработки

```bash
npm run test:watch
```

### Результаты тестов

```
Test Suites: 1 passed, 1 total
Tests:       76 passed, 76 total
Time:        ~1.5s
```

## 📁 Структура проекта

```
memory-game/
├── 📄 index.html          # Главная страница
├── 🎨 styles.css          # Стили и анимации
├── 📜 game.js             # Игровая логика (браузер)
├── 📦 gameUtils.js        # Утилиты для тестирования
├── 🖥️ server.js           # Локальный сервер
├── 📋 package.json        # Конфигурация npm
├── 📖 README.md           # Документация
│
├── 📁 tests/              # Тесты
│   ├── setup.js           # Настройка Jest
│   └── game.test.js       # Unit тесты (76 штук)
│
└── 📁 node_modules/       # Зависимости
```

## 🎮 Как играть

1. **Выберите уровень сложности** (EASY / NORM / HARD)

2. **Кликайте на карточки** чтобы перевернуть их

3. **Найдите все пары** за отведённое время

4. **Минимизируйте ходы** для лучшего результата

### Управление

| Действие | Управление |
|----------|------------|
| Перевернуть карту | Клик / Тап |
| Перезапуск | Кнопка 🔄 |
| Смена сложности | Кнопки EASY/NORM/HARD |

### Подсказки

- 💡 Запоминайте расположение карт с первых ходов
- 💡 Сначала открывайте угловые карты
- 💡 На сложных уровнях считайте ходы

## ⚙️ Конфигурация

### Изменение времени на уровень

Отредактируйте файл `gameUtils.js`:

```javascript
const DIFFICULTY = {
    easy: {
        pairs: 3,
        cols: 3,
        rows: 2,
        time: 30  // ← Измените время в секундах
    },
    // ...
};
```

### Изменение иконок

Отредактируйте массив `GAME_ICONS` в `gameUtils.js`:

```javascript
const GAME_ICONS = [
    'favorite', 'star', 'bolt', 'flash_on', 'wb_sunny',
    // Добавьте свои иконки из Material Icons
];
```

Доступные иконки: [Material Icons](https://fonts.google.com/icons)

### Изменение цветовой схемы

Отредактируйте CSS переменные в `styles.css`:

```css
:root {
    --primary: #4F46E5;        /* Основной цвет */
    --primary-light: #818CF8;  /* Светлый оттенок */
    --success: #10B981;        /* Цвет успеха */
    --error: #EF4444;          /* Цвет ошибки */
    /* ... */
}
```

## 📱 Telegram Mini App

### Настройка бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)

2. Отправьте команду `/newapp`

3. Укажите URL вашего сервера

4. Получите ссылку вида: `https://t.me/YourBot?startapp`

### Требования для production

- HTTPS соединение
- Валидный SSL сертификат
- Доменное имя

### Хостинг для Mini App

| Сервис | Описание |
|--------|----------|
| Vercel | Бесплатный хостинг с HTTPS |
| Netlify | Простой деплой |
| GitHub Pages | Статичный хостинг |
| Heroku | VPS хостинг |

## 🔧 Разработка

### Режим разработки

```bash
# Запуск сервера
npm start

# В другом терминале - тесты
npm run test:watch
```

### Добавление новых тестов

Создайте файл в папке `tests/`:

```javascript
// tests/myFeature.test.js
describe('My Feature', () => {
    test('should work correctly', () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = myFunction(input);
        
        // Assert
        expect(result).toBe('expected');
    });
});
```

### Отладка в браузере

Откройте DevTools (F12) и используйте консоль:

```javascript
// Получить текущее состояние игры
console.log(gameState);

// Изменить сложность
setDifficulty('hard');

// Перезапустить игру
initGame();
```

## 📊 API функций

### Основные функции

| Функция | Описание | Параметры |
|---------|----------|-----------|
| `initGame()` | Инициализация игры | — |
| `setDifficulty(level)` | Установка сложности | `'easy'` \| `'normal'` \| `'hard'` |
| `handleCardClick(index)` | Обработка клика по карте | `number` |
| `checkForMatch()` | Проверка совпадения | — |
| `startTimer()` | Запуск таймера | — |
| `stopTimer()` | Остановка таймера | — |

### Утилиты (тестируемые)

| Функция | Описание | Возвращает |
|---------|----------|------------|
| `shuffleArray(arr)` | Перемешивание массива | `Array` |
| `generateCards(difficulty)` | Генерация карт | `Object[]` |
| `checkMatch(card1, card2)` | Проверка пары | `boolean` |
| `formatTime(seconds)` | Форматирование времени | `string` |
| `isNewRecord(moves, time, record)` | Проверка рекорда | `boolean` |
| `saveRecord(difficulty, time, moves)` | Сохранение рекорда | `boolean` |

## 🐛 Устранение проблем

### Карточки не переворачиваются

- Проверьте поддержку CSS `transform-style: preserve-3d`
- Обновите браузер

### Telegram тема не применяется

- Убедитесь, что открыто в Telegram
- Проверьте загрузку SDK в консоли

### Тесты падают

```bash
# Очистить кэш Jest
npx jest --clearCache

# Переустановить зависимости
rm -rf node_modules
npm install
```

### Не сохраняются рекорды

- Проверьте, что localStorage не заблокирован
- Убедитесь, что не в режиме приватного просмотра

## 📈 Roadmap

- [ ] Мультиплеер режим
- [ ] Таблица лидеров
- [ ] Звуковые эффекты
- [ ] Дополнительные темы
- [ ] Достижения

## 📄 Лицензия

MIT License - используйте свободно

## 👨‍💻 Автор

Разработано для Telegram Mini Apps

---

**Если проект полезен — поставьте ⭐️ звезду!**
