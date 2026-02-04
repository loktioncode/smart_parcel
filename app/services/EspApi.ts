
const ESP_API_URL = 'http://192.168.4.1/api/cards';

export interface CardStatus {
    id: number;
    last_seen_ms_ago: number;
}

export interface EspResponse {
    cards: CardStatus[];
}

export const fetchActiveCards = async (): Promise<CardStatus[]> => {
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
        return data.cards;
    } catch (error) {
        console.log('Error fetching from ESP32:', error);
        return [];
    }
};
