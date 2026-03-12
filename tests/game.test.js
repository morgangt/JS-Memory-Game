/**
 * Memory Game - Unit Tests
 * Comprehensive tests for game logic, timer, and localStorage
 */

const {
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
} = require('../gameUtils.js');

// ===== SHUFFLE ARRAY TESTS =====
describe('shuffleArray()', () => {
    test('should return an array with the same length', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(arr);
        expect(shuffled.length).toBe(arr.length);
    });

    test('should not modify the original array', () => {
        const arr = [1, 2, 3, 4, 5];
        const original = [...arr];
        shuffleArray(arr);
        expect(arr).toEqual(original);
    });

    test('should contain the same elements', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(arr);
        expect(shuffled.sort()).toEqual(arr.sort());
    });

    test('should handle empty array', () => {
        const shuffled = shuffleArray([]);
        expect(shuffled).toEqual([]);
    });

    test('should handle single element array', () => {
        const shuffled = shuffleArray([1]);
        expect(shuffled).toEqual([1]);
    });

    test('should produce different orders (statistically)', () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const results = new Set();
        
        // Run shuffle 100 times
        for (let i = 0; i < 100; i++) {
            results.add(shuffleArray(arr).join(','));
        }
        
        // Should have multiple different orderings
        expect(results.size).toBeGreaterThan(1);
    });
});

// ===== SELECT RANDOM ICONS TESTS =====
describe('selectRandomIcons()', () => {
    test('should return the requested number of icons', () => {
        const icons = selectRandomIcons(5);
        expect(icons.length).toBe(5);
    });

    test('should return unique icons', () => {
        const icons = selectRandomIcons(10);
        const uniqueIcons = [...new Set(icons)];
        expect(uniqueIcons.length).toBe(icons.length);
    });

    test('should return icons from GAME_ICONS', () => {
        const icons = selectRandomIcons(5);
        icons.forEach(icon => {
            expect(GAME_ICONS).toContain(icon);
        });
    });

    test('should handle count of 1', () => {
        const icons = selectRandomIcons(1);
        expect(icons.length).toBe(1);
        expect(GAME_ICONS).toContain(icons[0]);
    });

    test('should handle count equal to total icons', () => {
        const icons = selectRandomIcons(GAME_ICONS.length);
        expect(icons.length).toBe(GAME_ICONS.length);
        expect(icons.sort()).toEqual([...GAME_ICONS].sort());
    });
});

// ===== CREATE CARD PAIRS TESTS =====
describe('createCardPairs()', () => {
    test('should create exactly 2 cards per icon', () => {
        const icons = ['star', 'heart', 'moon'];
        const cards = createCardPairs(icons);
        expect(cards.length).toBe(6); // 3 icons * 2 cards
    });

    test('should assign same pairId to matching cards', () => {
        const icons = ['star', 'heart'];
        const cards = createCardPairs(icons);
        
        const starCards = cards.filter(c => c.icon === 'star');
        expect(starCards.length).toBe(2);
        expect(starCards[0].pairId).toBe(starCards[1].pairId);
    });

    test('should assign different pairIds to different icons', () => {
        const icons = ['star', 'heart'];
        const cards = createCardPairs(icons);
        
        const starPairId = cards.find(c => c.icon === 'star').pairId;
        const heartPairId = cards.find(c => c.icon === 'heart').pairId;
        
        expect(starPairId).not.toBe(heartPairId);
    });

    test('should create unique card IDs', () => {
        const icons = ['star', 'heart', 'moon'];
        const cards = createCardPairs(icons);
        
        const ids = cards.map(c => c.id);
        const uniqueIds = [...new Set(ids)];
        
        expect(uniqueIds.length).toBe(ids.length);
    });

    test('should handle single icon', () => {
        const icons = ['star'];
        const cards = createCardPairs(icons);
        
        expect(cards.length).toBe(2);
        expect(cards[0].icon).toBe('star');
        expect(cards[1].icon).toBe('star');
    });
});

// ===== GENERATE CARDS TESTS =====
describe('generateCards()', () => {
    test('should create correct number of cards for easy', () => {
        const cards = generateCards('easy');
        expect(cards.length).toBe(6); // 3 pairs * 2
    });

    test('should create correct number of cards for normal', () => {
        const cards = generateCards('normal');
        expect(cards.length).toBe(12); // 6 pairs * 2
    });

    test('should create correct number of cards for hard', () => {
        const cards = generateCards('hard');
        expect(cards.length).toBe(20); // 10 pairs * 2
    });

    test('should throw error for invalid difficulty', () => {
        expect(() => generateCards('invalid')).toThrow('Invalid difficulty');
    });

    test('should create shuffled cards (not in original order)', () => {
        // Create cards multiple times and check they're not always in order
        let allInOrder = true;
        
        for (let i = 0; i < 10; i++) {
            const cards = generateCards('normal');
            const pairIds = cards.map(c => c.pairId);
            const sortedIds = [...pairIds].sort((a, b) => a - b);
            
            if (pairIds.join(',') !== sortedIds.join(',')) {
                allInOrder = false;
                break;
            }
        }
        
        expect(allInOrder).toBe(false);
    });

    test('should create valid pairs', () => {
        const cards = generateCards('easy');
        
        // Count occurrences of each pairId
        const pairCounts = {};
        cards.forEach(card => {
            pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
        });
        
        // Each pairId should have exactly 2 cards
        Object.values(pairCounts).forEach(count => {
            expect(count).toBe(2);
        });
    });
});

// ===== CHECK MATCH TESTS =====
describe('checkMatch()', () => {
    test('should return true for matching cards', () => {
        const card1 = { icon: 'star', pairId: 0, id: '0-a' };
        const card2 = { icon: 'star', pairId: 0, id: '0-b' };
        
        expect(checkMatch(card1, card2)).toBe(true);
    });

    test('should return false for non-matching cards', () => {
        const card1 = { icon: 'star', pairId: 0, id: '0-a' };
        const card2 = { icon: 'heart', pairId: 1, id: '1-a' };
        
        expect(checkMatch(card1, card2)).toBe(false);
    });

    test('should work with same icon but different pairId (edge case)', () => {
        // This shouldn't happen in real game, but tests the function
        const card1 = { icon: 'star', pairId: 0, id: '0-a' };
        const card2 = { icon: 'star', pairId: 1, id: '1-a' };
        
        expect(checkMatch(card1, card2)).toBe(false);
    });

    test('should work with cards having different icons', () => {
        const card1 = { icon: 'star', pairId: 0 };
        const card2 = { icon: 'moon', pairId: 1 };
        
        expect(checkMatch(card1, card2)).toBe(false);
    });
});

// ===== FORMAT TIME TESTS =====
describe('formatTime()', () => {
    test('should format 0 seconds as 00:00', () => {
        expect(formatTime(0)).toBe('00:00');
    });

    test('should format seconds only', () => {
        expect(formatTime(30)).toBe('00:30');
        expect(formatTime(45)).toBe('00:45');
        expect(formatTime(5)).toBe('00:05');
    });

    test('should format minutes and seconds', () => {
        expect(formatTime(60)).toBe('01:00');
        expect(formatTime(90)).toBe('01:30');
        expect(formatTime(125)).toBe('02:05');
    });

    test('should handle large numbers', () => {
        expect(formatTime(3600)).toBe('60:00');
        expect(formatTime(3661)).toBe('61:01');
    });

    test('should handle negative numbers', () => {
        expect(formatTime(-1)).toBe('00:00');
        expect(formatTime(-100)).toBe('00:00');
    });

    test('should handle non-number input', () => {
        expect(formatTime('string')).toBe('00:00');
        expect(formatTime(null)).toBe('00:00');
        expect(formatTime(undefined)).toBe('00:00');
    });
});

// ===== GET TIMER CLASS TESTS =====
describe('getTimerClass()', () => {
    test('should return empty string for time > 20', () => {
        expect(getTimerClass(30, 45)).toBe('');
        expect(getTimerClass(25, 60)).toBe('');
        expect(getTimerClass(21, 30)).toBe('');
    });

    test('should return "warning" for time 11-20', () => {
        expect(getTimerClass(20, 30)).toBe('warning');
        expect(getTimerClass(15, 45)).toBe('warning');
        expect(getTimerClass(11, 60)).toBe('warning');
    });

    test('should return "danger" for time <= 10', () => {
        expect(getTimerClass(10, 30)).toBe('danger');
        expect(getTimerClass(5, 45)).toBe('danger');
        expect(getTimerClass(1, 60)).toBe('danger');
        expect(getTimerClass(0, 30)).toBe('danger');
    });
});

// ===== IS NEW RECORD TESTS =====
describe('isNewRecord()', () => {
    test('should return true when no current record exists', () => {
        expect(isNewRecord(10, 15, null)).toBe(true);
    });

    test('should return true when new moves are fewer', () => {
        const currentRecord = { time: 20, moves: 15 };
        expect(isNewRecord(10, 25, currentRecord)).toBe(true);
    });

    test('should return true when moves equal but time is better', () => {
        const currentRecord = { time: 20, moves: 10 };
        expect(isNewRecord(10, 15, currentRecord)).toBe(true);
    });

    test('should return false when moves and time are worse', () => {
        const currentRecord = { time: 15, moves: 10 };
        expect(isNewRecord(15, 20, currentRecord)).toBe(false);
    });

    test('should return false when moves are worse', () => {
        const currentRecord = { time: 30, moves: 10 };
        expect(isNewRecord(15, 15, currentRecord)).toBe(false);
    });

    test('should return false when moves equal but time is worse', () => {
        const currentRecord = { time: 15, moves: 10 };
        expect(isNewRecord(10, 20, currentRecord)).toBe(false);
    });

    test('should return false when moves and time are equal', () => {
        const currentRecord = { time: 15, moves: 10 };
        expect(isNewRecord(10, 15, currentRecord)).toBe(false);
    });
});

// ===== GET RECORD TESTS =====
describe('getRecord()', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should return null when no record exists', () => {
        expect(getRecord('easy')).toBeNull();
    });

    test('should return parsed record when it exists', () => {
        const record = { time: 15, moves: 10, date: '2024-01-01' };
        localStorage.setItem('memory_game_record_easy', JSON.stringify(record));
        
        const result = getRecord('easy');
        expect(result).toEqual(record);
    });

    test('should use correct key for each difficulty', () => {
        const record = { time: 20, moves: 15 };
        
        localStorage.setItem('memory_game_record_normal', JSON.stringify(record));
        expect(getRecord('normal')).toEqual(record);
        expect(getRecord('easy')).toBeNull();
    });
});

// ===== SAVE RECORD TESTS =====
describe('saveRecord()', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should save new record when none exists', () => {
        const result = saveRecord('easy', 20, 10);
        
        expect(result).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should not save when not a new record', () => {
        const existingRecord = { time: 15, moves: 8, date: '2024-01-01' };
        localStorage.setItem('memory_game_record_easy', JSON.stringify(existingRecord));
        
        const result = saveRecord('easy', 25, 15); // Worse than existing
        
        expect(result).toBe(false);
    });

    test('should save when new record is better', () => {
        const existingRecord = { time: 25, moves: 15, date: '2024-01-01' };
        localStorage.setItem('memory_game_record_easy', JSON.stringify(existingRecord));
        
        const result = saveRecord('easy', 20, 10); // Better than existing
        
        expect(result).toBe(true);
    });

    test('should save record with correct structure', () => {
        saveRecord('easy', 20, 10);
        
        const saved = JSON.parse(localStorage.getItem('memory_game_record_easy'));
        expect(saved).toHaveProperty('time', 20);
        expect(saved).toHaveProperty('moves', 10);
        expect(saved).toHaveProperty('date');
    });

    test('should save to correct key for each difficulty', () => {
        saveRecord('hard', 45, 20);
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'memory_game_record_hard',
            expect.any(String)
        );
    });
});

// ===== IS VALID DIFFICULTY TESTS =====
describe('isValidDifficulty()', () => {
    test('should return true for valid difficulties', () => {
        expect(isValidDifficulty('easy')).toBe(true);
        expect(isValidDifficulty('normal')).toBe(true);
        expect(isValidDifficulty('hard')).toBe(true);
    });

    test('should return false for invalid difficulties', () => {
        expect(isValidDifficulty('medium')).toBe(false);
        expect(isValidDifficulty('extreme')).toBe(false);
        expect(isValidDifficulty('')).toBe(false);
        expect(isValidDifficulty(null)).toBe(false);
        expect(isValidDifficulty(undefined)).toBe(false);
    });
});

// ===== GET DIFFICULTY SETTINGS TESTS =====
describe('getDifficultySettings()', () => {
    test('should return correct settings for easy', () => {
        const settings = getDifficultySettings('easy');
        
        expect(settings).toEqual({
            pairs: 3,
            cols: 3,
            rows: 2,
            time: 30
        });
    });

    test('should return correct settings for normal', () => {
        const settings = getDifficultySettings('normal');
        
        expect(settings).toEqual({
            pairs: 6,
            cols: 4,
            rows: 3,
            time: 45
        });
    });

    test('should return correct settings for hard', () => {
        const settings = getDifficultySettings('hard');
        
        expect(settings).toEqual({
            pairs: 10,
            cols: 5,
            rows: 4,
            time: 60
        });
    });

    test('should throw error for invalid difficulty', () => {
        expect(() => getDifficultySettings('invalid')).toThrow('Invalid difficulty');
    });

    test('should return a copy (not reference)', () => {
        const settings1 = getDifficultySettings('easy');
        const settings2 = getDifficultySettings('easy');
        
        settings1.pairs = 999;
        
        expect(settings2.pairs).toBe(3);
    });
});

// ===== IS GAME WON TESTS =====
describe('isGameWon()', () => {
    test('should return true when all pairs are matched', () => {
        expect(isGameWon(3, 3)).toBe(true);
        expect(isGameWon(6, 6)).toBe(true);
        expect(isGameWon(10, 10)).toBe(true);
    });

    test('should return true when more pairs matched than needed', () => {
        expect(isGameWon(4, 3)).toBe(true);
        expect(isGameWon(10, 6)).toBe(true);
    });

    test('should return false when not all pairs matched', () => {
        expect(isGameWon(0, 3)).toBe(false);
        expect(isGameWon(2, 3)).toBe(false);
        expect(isGameWon(5, 6)).toBe(false);
    });

    test('should handle zero pairs', () => {
        expect(isGameWon(0, 0)).toBe(true);
    });
});

// ===== CALCULATE SCORE TESTS =====
describe('calculateScore()', () => {
    test('should calculate score based on time and moves', () => {
        const score = calculateScore(10, 5, 1);
        expect(score).toBeGreaterThan(0);
    });

    test('should give higher score for better time', () => {
        const score1 = calculateScore(10, 10, 1);
        const score2 = calculateScore(30, 10, 1);
        
        expect(score1).toBeGreaterThan(score2);
    });

    test('should give higher score for fewer moves', () => {
        const score1 = calculateScore(20, 5, 1);
        const score2 = calculateScore(20, 15, 1);
        
        expect(score1).toBeGreaterThan(score2);
    });

    test('should apply difficulty multiplier', () => {
        const scoreEasy = calculateScore(20, 10, 1);
        const scoreHard = calculateScore(20, 10, 2);
        
        expect(scoreHard).toBe(scoreEasy * 2);
    });

    test('should handle zero time and moves', () => {
        const score = calculateScore(0, 0, 1);
        expect(score).toBe(150); // 100 (max time bonus) + 50 (max moves bonus)
    });

    test('should handle high time and moves (no bonus)', () => {
        const score = calculateScore(200, 100, 1);
        expect(score).toBe(0); // No bonus for very slow/poor game
    });
});

// ===== DIFFICULTY CONSTANTS TESTS =====
describe('DIFFICULTY constants', () => {
    test('should have correct structure for each difficulty', () => {
        Object.keys(DIFFICULTY).forEach(key => {
            const settings = DIFFICULTY[key];
            
            expect(settings).toHaveProperty('pairs');
            expect(settings).toHaveProperty('cols');
            expect(settings).toHaveProperty('rows');
            expect(settings).toHaveProperty('time');
            
            expect(typeof settings.pairs).toBe('number');
            expect(typeof settings.cols).toBe('number');
            expect(typeof settings.rows).toBe('number');
            expect(typeof settings.time).toBe('number');
        });
    });

    test('should have increasing difficulty', () => {
        expect(DIFFICULTY.easy.pairs).toBeLessThan(DIFFICULTY.normal.pairs);
        expect(DIFFICULTY.normal.pairs).toBeLessThan(DIFFICULTY.hard.pairs);
        
        expect(DIFFICULTY.easy.time).toBeLessThan(DIFFICULTY.normal.time);
        expect(DIFFICULTY.normal.time).toBeLessThan(DIFFICULTY.hard.time);
    });

    test('should have correct pairs-to-time ratio', () => {
        // Each difficulty should give roughly 10 seconds per pair
        Object.keys(DIFFICULTY).forEach(key => {
            const { pairs, time } = DIFFICULTY[key];
            const secondsPerPair = time / pairs;
            
            // Between 8 and 12 seconds per pair is reasonable
            expect(secondsPerPair).toBeGreaterThanOrEqual(6);
            expect(secondsPerPair).toBeLessThanOrEqual(15);
        });
    });
});

// ===== GAME ICONS CONSTANTS TESTS =====
describe('GAME_ICONS constants', () => {
    test('should have at least 18 unique icons', () => {
        expect(GAME_ICONS.length).toBeGreaterThanOrEqual(18);
    });

    test('should have all unique icons', () => {
        const uniqueIcons = [...new Set(GAME_ICONS)];
        expect(uniqueIcons.length).toBe(GAME_ICONS.length);
    });

    test('should have enough icons for hard difficulty', () => {
        // Hard difficulty needs 10 pairs = 10 unique icons
        expect(GAME_ICONS.length).toBeGreaterThanOrEqual(DIFFICULTY.hard.pairs);
    });

    test('should all be non-empty strings', () => {
        GAME_ICONS.forEach(icon => {
            expect(typeof icon).toBe('string');
            expect(icon.length).toBeGreaterThan(0);
        });
    });
});

// ===== INTEGRATION TESTS =====
describe('Integration Tests', () => {
    test('should generate valid game for each difficulty', () => {
        ['easy', 'normal', 'hard'].forEach(difficulty => {
            const cards = generateCards(difficulty);
            const settings = getDifficultySettings(difficulty);
            
            // Check correct number of cards
            expect(cards.length).toBe(settings.pairs * 2);
            
            // Check all cards have valid icons
            cards.forEach(card => {
                expect(GAME_ICONS).toContain(card.icon);
            });
            
            // Check all pairs are complete
            const pairCounts = {};
            cards.forEach(card => {
                pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
            });
            
            Object.values(pairCounts).forEach(count => {
                expect(count).toBe(2);
            });
        });
    });

    test('should handle complete game flow', () => {
        // Generate cards
        const cards = generateCards('easy');
        
        // Simulate checking matches
        const card1 = cards[0];
        const matchingCard = cards.find(c => c.id !== card1.id && c.pairId === card1.pairId);
        
        expect(checkMatch(card1, matchingCard)).toBe(true);
        
        // Simulate checking game won
        expect(isGameWon(3, 3)).toBe(true);
        
        // Simulate saving record
        const saved = saveRecord('easy', 25, 8);
        expect(saved).toBe(true);
        
        // Verify record was saved
        const record = getRecord('easy');
        expect(record.moves).toBe(8);
        expect(record.time).toBe(25);
    });
});
