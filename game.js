/**
 * Memory Game - Telegram Mini App
 * A classic memory card matching game with three difficulty levels
 */

// ===== Game Icons (Material Icons) =====
const GAME_ICONS = [
    'favorite', 'star', 'bolt', 'flash_on', 'wb_sunny',
    'nights_stay', 'water_drop', 'local_fire_department', 
    'emoji_nature', 'pets', 'flutter_dash', 'cruelty_free',
    'psychology', 'lightbulb', 'diamond', 'auto_awesome',
    'rocket_launch', 'celebration', 'music_note', 'headphones',
    'coffee', 'local_pizza', 'icecream', 'cake',
    'sports_esports', 'sports_soccer', 'sports_basketball', 'sports_tennis',
    'directions_car', 'flight', 'sailing', 'rocket',
    'anchor', 'forest', 'landscape', 'waves'
];

// ===== Difficulty Settings =====
const DIFFICULTY = {
    easy: {
        pairs: 3,
        cols: 3,
        rows: 2,
        time: 30
    },
    normal: {
        pairs: 6,
        cols: 4,
        rows: 3,
        time: 45
    },
    hard: {
        pairs: 10,
        cols: 5,
        rows: 4,
        time: 60
    }
};

// ===== Game State =====
let gameState = {
    difficulty: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timeLeft: 30,
    timerInterval: null,
    isLocked: false,
    gameStarted: false,
    totalPairs: 3
};

// ===== DOM Elements =====
const elements = {
    gameContainer: document.getElementById('gameContainer'),
    gameBoard: document.getElementById('gameBoard'),
    timer: document.getElementById('timer'),
    moves: document.getElementById('moves'),
    restartBtn: document.getElementById('restartBtn'),
    cardTemplate: document.getElementById('cardTemplate'),
    modalOverlay: document.getElementById('modalOverlay'),
    modal: document.getElementById('modal'),
    modalIcon: document.getElementById('modalIcon'),
    modalTitle: document.getElementById('modalTitle'),
    modalSubtitle: document.getElementById('modalSubtitle'),
    modalStats: document.getElementById('modalStats'),
    modalRecord: document.getElementById('modalRecord'),
    finalTime: document.getElementById('finalTime'),
    finalMoves: document.getElementById('finalMoves'),
    modalBtn: document.getElementById('modalBtn'),
    confettiContainer: document.getElementById('confettiContainer'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn')
};

// ===== Initialize Game =====
function initGame() {
    resetGameState();
    createCards();
    updateUI();
    stopTimer();
}

function resetGameState() {
    const settings = DIFFICULTY[gameState.difficulty];
    gameState = {
        ...gameState,
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timeLeft: settings.time,
        isLocked: false,
        gameStarted: false,
        totalPairs: settings.pairs
    };
}

// ===== Create Cards =====
function createCards() {
    const settings = DIFFICULTY[gameState.difficulty];
    
    // Update board grid class
    elements.gameBoard.className = `game-board ${gameState.difficulty}`;
    elements.gameBoard.innerHTML = '';
    
    // Select random icons for pairs
    const shuffledIcons = [...GAME_ICONS].sort(() => Math.random() - 0.5);
    const selectedIcons = shuffledIcons.slice(0, settings.pairs);
    
    // Create pairs (each icon appears twice)
    const cardPairs = [...selectedIcons, ...selectedIcons];
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    // Create card elements
    shuffledCards.forEach((icon, index) => {
        const card = createCardElement(icon, index);
        elements.gameBoard.appendChild(card);
        gameState.cards.push({
            element: card,
            icon: icon,
            index: index,
            isFlipped: false,
            isMatched: false
        });
    });
}

function createCardElement(icon, index) {
    const template = elements.cardTemplate.content;
    const card = template.cloneNode(true).querySelector('.card');
    
    card.dataset.index = index;
    card.querySelector('.card-icon').textContent = icon;
    
    card.addEventListener('click', () => handleCardClick(index));
    
    return card;
}

// ===== Card Click Handler =====
function handleCardClick(index) {
    const card = gameState.cards[index];
    
    // Ignore if locked, already flipped, or matched
    if (gameState.isLocked || card.isFlipped || card.isMatched) {
        return;
    }
    
    // Start timer on first click
    if (!gameState.gameStarted) {
        startTimer();
        gameState.gameStarted = true;
    }
    
    // Flip the card
    flipCard(index);
    gameState.flippedCards.push(index);
    
    // Check for match when 2 cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateUI();
        checkForMatch();
    }
}

function flipCard(index) {
    const card = gameState.cards[index];
    card.isFlipped = true;
    card.element.classList.add('flipped');
}

function unflipCard(index) {
    const card = gameState.cards[index];
    card.isFlipped = false;
    card.element.classList.remove('flipped');
}

// ===== Match Checking =====
function checkForMatch() {
    gameState.isLocked = true;
    
    const [firstIndex, secondIndex] = gameState.flippedCards;
    const firstCard = gameState.cards[firstIndex];
    const secondCard = gameState.cards[secondIndex];
    
    if (firstCard.icon === secondCard.icon) {
        // Match found!
        handleMatch(firstIndex, secondIndex);
    } else {
        // No match - shake and unflip
        handleMismatch(firstIndex, secondIndex);
    }
}

function handleMatch(firstIndex, secondIndex) {
    const firstCard = gameState.cards[firstIndex];
    const secondCard = gameState.cards[secondIndex];
    
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');
    
    gameState.matchedPairs++;
    gameState.flippedCards = [];
    gameState.isLocked = false;
    
    // Check for win
    if (gameState.matchedPairs === gameState.totalPairs) {
        handleWin();
    }
}

function handleMismatch(firstIndex, secondIndex) {
    const firstCard = gameState.cards[firstIndex];
    const secondCard = gameState.cards[secondIndex];
    
    // Add wrong animation to cards
    firstCard.element.classList.add('wrong');
    secondCard.element.classList.add('wrong');
    
    // Shake the screen
    elements.gameContainer.classList.add('shake');
    
    // Remove animations and unflip after delay
    setTimeout(() => {
        firstCard.element.classList.remove('wrong');
        secondCard.element.classList.remove('wrong');
        elements.gameContainer.classList.remove('shake');
        
        unflipCard(firstIndex);
        unflipCard(secondIndex);
        
        gameState.flippedCards = [];
        gameState.isLocked = false;
    }, 800);
}

// ===== Timer =====
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            handleLose();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    elements.timer.textContent = gameState.timeLeft;
    
    // Add warning colors
    if (gameState.timeLeft <= 10) {
        elements.timer.classList.add('danger');
        elements.timer.classList.remove('warning');
    } else if (gameState.timeLeft <= 20) {
        elements.timer.classList.add('warning');
        elements.timer.classList.remove('danger');
    } else {
        elements.timer.classList.remove('warning', 'danger');
    }
}

// ===== Win/Lose Handlers =====
function handleWin() {
    stopTimer();
    
    const timeUsed = DIFFICULTY[gameState.difficulty].time - gameState.timeLeft;
    const isNewRecord = checkAndSaveRecord(timeUsed, gameState.moves);
    
    showModal(true, timeUsed, isNewRecord);
    createConfetti();
}

function handleLose() {
    stopTimer();
    gameState.isLocked = true;
    
    showModal(false, 0, false);
}

// ===== Modal =====
function showModal(isWin, timeUsed, isNewRecord) {
    elements.modalIcon.innerHTML = isWin 
        ? '<span class="material-icons-round">celebration</span>'
        : '<span class="material-icons-round">sentiment_very_dissatisfied</span>';
    elements.modalIcon.className = `modal-icon ${isWin ? 'win' : 'lose'}`;
    
    elements.modalTitle.textContent = isWin ? 'Поздравляем!' : 'Время вышло!';
    elements.modalSubtitle.textContent = isWin 
        ? 'Вы нашли все пары!' 
        : 'Попробуйте ещё раз!';
    
    elements.finalTime.textContent = formatTime(timeUsed);
    elements.finalMoves.textContent = gameState.moves;
    
    if (isWin && isNewRecord) {
        elements.modalRecord.classList.add('show');
    } else {
        elements.modalRecord.classList.remove('show');
    }
    
    elements.modalOverlay.classList.add('show');
}

function hideModal() {
    elements.modalOverlay.classList.remove('show');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ===== Confetti Animation =====
function createConfetti() {
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const shapes = ['■', '●', '▲', '◆', '★'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            // Random shape
            if (Math.random() > 0.5) {
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = `${Math.random() * 12 + 8}px`;
                confetti.style.backgroundColor = 'transparent';
                confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            elements.confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ===== Records (localStorage) =====
function checkAndSaveRecord(timeUsed, moves) {
    const difficulty = gameState.difficulty;
    const recordKey = `memory_game_record_${difficulty}`;
    const currentRecord = localStorage.getItem(recordKey);
    
    const newRecord = {
        time: timeUsed,
        moves: moves,
        date: new Date().toISOString()
    };
    
    if (!currentRecord) {
        localStorage.setItem(recordKey, JSON.stringify(newRecord));
        return true;
    }
    
    const parsedRecord = JSON.parse(currentRecord);
    
    // Better record = fewer moves (primary) or less time (secondary)
    if (moves < parsedRecord.moves || (moves === parsedRecord.moves && timeUsed < parsedRecord.time)) {
        localStorage.setItem(recordKey, JSON.stringify(newRecord));
        return true;
    }
    
    return false;
}

function getRecord(difficulty) {
    const recordKey = `memory_game_record_${difficulty}`;
    const record = localStorage.getItem(recordKey);
    return record ? JSON.parse(record) : null;
}

// ===== UI Updates =====
function updateUI() {
    elements.moves.textContent = gameState.moves;
    updateTimerDisplay();
}

// ===== Difficulty Selection =====
function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    
    // Update active button
    elements.difficultyBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
    
    // Restart game with new difficulty
    initGame();
}

// ===== Event Listeners =====
elements.difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setDifficulty(btn.dataset.difficulty);
    });
});

elements.restartBtn.addEventListener('click', initGame);

elements.modalBtn.addEventListener('click', () => {
    hideModal();
    initGame();
});

// Close modal on overlay click
elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
        hideModal();
        initGame();
    }
});

// ===== Telegram Mini App Integration =====
function initTelegramMiniApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Initialize Telegram WebApp
        tg.ready();
        
        // Expand to full height
        tg.expand();
        
        // Set theme
        document.body.style.backgroundColor = tg.backgroundColor || '#F8FAFC';
        
        // Handle back button
        if (tg.BackButton) {
            tg.BackButton.show();
            tg.BackButton.onClick(() => {
                tg.close();
            });
        }
        
        // Apply Telegram theme if available
        if (tg.themeParams) {
            const params = tg.themeParams;
            if (params.bg_color) {
                document.documentElement.style.setProperty('--bg-main', params.bg_color);
            }
            if (params.text_color) {
                document.documentElement.style.setProperty('--text-primary', params.text_color);
            }
        }
    }
}

// ===== Start Game =====
document.addEventListener('DOMContentLoaded', () => {
    initTelegramMiniApp();
    initGame();
});

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
