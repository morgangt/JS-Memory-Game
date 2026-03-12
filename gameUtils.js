/**
 * Memory Game - Pure Functions for Testing
 * These functions are exported for unit testing
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

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array (new array)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Selects random icons for the game
 * @param {number} count - Number of unique icons needed
 * @returns {string[]} - Array of selected icon names
 */
function selectRandomIcons(count) {
    const shuffled = shuffleArray(GAME_ICONS);
    return shuffled.slice(0, count);
}

/**
 * Creates card pairs from icons
 * @param {string[]} icons - Array of icon names
 * @returns {Object[]} - Array of card objects with icon and pairId
 */
function createCardPairs(icons) {
    const cards = [];
    icons.forEach((icon, index) => {
        // Add two cards for each icon (pair)
        cards.push({ icon, pairId: index, id: `${index}-a` });
        cards.push({ icon, pairId: index, id: `${index}-b` });
    });
    return cards;
}

/**
 * Generates shuffled cards for a game
 * @param {string} difficulty - Difficulty level ('easy', 'normal', 'hard')
 * @returns {Object[]} - Shuffled array of card objects
 */
function generateCards(difficulty) {
    const settings = DIFFICULTY[difficulty];
    if (!settings) {
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
    
    const icons = selectRandomIcons(settings.pairs);
    const cards = createCardPairs(icons);
    return shuffleArray(cards);
}

/**
 * Checks if two cards match
 * @param {Object} card1 - First card object
 * @param {Object} card2 - Second card object
 * @returns {boolean} - True if cards match
 */
function checkMatch(card1, card2) {
    return card1.pairId === card2.pairId;
}

/**
 * Formats time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
function formatTime(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
        return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates timer display class based on time remaining
 * @param {number} timeLeft - Remaining time in seconds
 * @param {number} totalTime - Total time for the difficulty
 * @returns {string} - CSS class name ('', 'warning', or 'danger')
 */
function getTimerClass(timeLeft, totalTime) {
    if (timeLeft <= 10) return 'danger';
    if (timeLeft <= 20) return 'warning';
    return '';
}

/**
 * Checks if a new record is achieved
 * @param {number} newMoves - Number of moves in new game
 * @param {number} newTime - Time used in new game
 * @param {Object|null} currentRecord - Current record object or null
 * @returns {boolean} - True if new record
 */
function isNewRecord(newMoves, newTime, currentRecord) {
    if (!currentRecord) return true;
    
    // Better = fewer moves (primary) or same moves but less time (secondary)
    if (newMoves < currentRecord.moves) return true;
    if (newMoves === currentRecord.moves && newTime < currentRecord.time) return true;
    
    return false;
}

/**
 * Gets record from localStorage
 * @param {string} difficulty - Difficulty level
 * @returns {Object|null} - Record object or null
 */
function getRecord(difficulty, storage = localStorage) {
    const recordKey = `memory_game_record_${difficulty}`;
    const record = storage.getItem(recordKey);
    return record ? JSON.parse(record) : null;
}

/**
 * Saves record to localStorage
 * @param {string} difficulty - Difficulty level
 * @param {number} time - Time used
 * @param {number} moves - Number of moves
 * @param {Storage} storage - Storage object (default: localStorage)
 * @returns {boolean} - True if saved as new record
 */
function saveRecord(difficulty, time, moves, storage = localStorage) {
    const currentRecord = getRecord(difficulty, storage);
    
    if (!isNewRecord(moves, time, currentRecord)) {
        return false;
    }
    
    const recordKey = `memory_game_record_${difficulty}`;
    const newRecord = {
        time,
        moves,
        date: new Date().toISOString()
    };
    
    storage.setItem(recordKey, JSON.stringify(newRecord));
    return true;
}

/**
 * Validates difficulty level
 * @param {string} difficulty - Difficulty to validate
 * @returns {boolean} - True if valid
 */
function isValidDifficulty(difficulty) {
    return Object.keys(DIFFICULTY).includes(difficulty);
}

/**
 * Gets difficulty settings
 * @param {string} difficulty - Difficulty level
 * @returns {Object} - Settings object
 */
function getDifficultySettings(difficulty) {
    if (!isValidDifficulty(difficulty)) {
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
    return { ...DIFFICULTY[difficulty] };
}

/**
 * Checks if the game is won (all pairs matched)
 * @param {number} matchedPairs - Number of matched pairs
 * @param {number} totalPairs - Total pairs in game
 * @returns {boolean} - True if game is won
 */
function isGameWon(matchedPairs, totalPairs) {
    return matchedPairs >= totalPairs;
}

/**
 * Calculates game score
 * @param {number} timeUsed - Time in seconds
 * @param {number} moves - Number of moves
 * @param {number} difficultyMultiplier - Score multiplier based on difficulty
 * @returns {number} - Calculated score
 */
function calculateScore(timeUsed, moves, difficultyMultiplier = 1) {
    const timeBonus = Math.max(0, 100 - timeUsed);
    const movesBonus = Math.max(0, 50 - moves);
    return Math.floor((timeBonus + movesBonus) * difficultyMultiplier);
}

// ===== Exports =====
module.exports = {
    GAME_ICONS,
    DIFFICULTY,
    shuffleArray,
    selectRandomIcons,
    createCardPairs,
    generateCards,
    checkMatch,
    formatTime,
    getTimerClass,
    isNewRecord,
    getRecord,
    saveRecord,
    isValidDifficulty,
    getDifficultySettings,
    isGameWon,
    calculateScore
};
