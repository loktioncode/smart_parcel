
const ESP_API_URL = 'http://192.168.4.1/api/cards';

export interface CardStatus {
    id: number;
    last_seen_ms_ago: number;
}

export interface EspResponse {
    cards: CardStatus[];
}

// Static demo data for offline/demo mode
export const DEMO_CARDS: CardStatus[] = [
    { id: 1, last_seen_ms_ago: 500 },
    { id: 2, last_seen_ms_ago: 1200 },
    { id: 3, last_seen_ms_ago: 95000 }, // This one appears "outside" (offline for 45s)
];

// Connection status tracking
let connectionAttempts = 0;
let lastSuccessfulConnection: Date | null = null;

export interface FetchResult {
    cards: CardStatus[];
    isConnected: boolean;
    isOfflineMode: boolean;
}

export const fetchActiveCards = async (): Promise<FetchResult> => {
    connectionAttempts++;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

        const response = await fetch(ESP_API_URL, {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EspResponse = await response.json();
        lastSuccessfulConnection = new Date();
        connectionAttempts = 0; // Reset attempts on success

        return {
            cards: data.cards,
            isConnected: true,
            isOfflineMode: false,
        };
    } catch (error) {
        console.log('Error fetching from ESP32:', error);

        // After 3 failed attempts, switch to demo mode
        const isOfflineMode = connectionAttempts >= 3;

        return {
            cards: isOfflineMode ? DEMO_CARDS : [],
            isConnected: false,
            isOfflineMode,
        };
    }
};

// Helper to check if we've ever successfully connected
export const hasEverConnected = (): boolean => lastSuccessfulConnection !== null;

// Reset connection tracking (useful for testing or reconnection attempts)
export const resetConnectionTracking = (): void => {
    connectionAttempts = 0;
    lastSuccessfulConnection = null;
};
