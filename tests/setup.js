/**
 * Jest Setup File
 * Configures test environment with DOM mocks and helpers
 */

// ===== LocalStorage Mock =====
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        getStore: () => store
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

// ===== Clear localStorage before each test =====
beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

// ===== Mock Telegram WebApp =====
global.Telegram = {
    WebApp: {
        ready: jest.fn(),
        expand: jest.fn(),
        close: jest.fn(),
        BackButton: {
            show: jest.fn(),
            onClick: jest.fn()
        },
        backgroundColor: '#F8FAFC',
        themeParams: {}
    }
};

// ===== Helper to create mock DOM elements =====
global.createMockDOM = () => {
    document.body.innerHTML = `
        <div class="game-container" id="gameContainer">
            <div class="difficulty-controls">
                <button class="difficulty-btn active" data-difficulty="easy">EASY</button>
                <button class="difficulty-btn" data-difficulty="normal">NORM</button>
                <button class="difficulty-btn" data-difficulty="hard">HARD</button>
            </div>
            <div class="game-board" id="gameBoard"></div>
            <span id="timer">30</span>
            <span id="moves">0</span>
            <button id="restartBtn"></button>
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal" id="modal">
                    <div class="modal-icon" id="modalIcon"></div>
                    <h2 class="modal-title" id="modalTitle"></h2>
                    <p class="modal-subtitle" id="modalSubtitle"></p>
                    <div class="modal-stats" id="modalStats">
                        <span id="finalTime"></span>
                        <span id="finalMoves"></span>
                    </div>
                    <div class="modal-record" id="modalRecord"></div>
                    <button id="modalBtn"></button>
                </div>
            </div>
            <div class="confetti-container" id="confettiContainer"></div>
        </div>
        <template id="cardTemplate">
            <div class="card" data-index="">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-pattern">
                            <span class="material-icons-round">help_outline</span>
                        </div>
                    </div>
                    <div class="card-back">
                        <span class="card-icon"></span>
                    </div>
                </div>
            </div>
        </template>
    `;
};

// ===== Helper to wait for animations/timeouts =====
global.wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ===== Mock timers for timer tests =====
jest.useFakeTimers();
