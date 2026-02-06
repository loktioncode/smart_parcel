import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BillingSettings {
    gracePeriod: number; // minutes
    penaltyRate: number; // dollars per minute
}

interface CardSession {
    cardId: number;
    ownerName?: string;
    offlineSince: number | null; // Timestamp (ms) when card went offline. Null if online.
    currentBill: number; // Accumulated bill for CLOSED sessions (if we want history), or just transient?
}

// History event for tracking when cards leave and return
export interface HistoryEvent {
    id: string;
    cardId: number;
    type: 'left' | 'returned' | 'registered';
    timestamp: number; // Unix timestamp in ms
    penalty?: number; // For 'returned' events
    durationMinutes?: number; // For 'returned' events
}

interface BillingContextType {
    settings: BillingSettings;
    updateSettings: (newSettings: Partial<BillingSettings>) => Promise<void>;
    cardSessions: Record<number, CardSession>;
    handleCardStatusChange: (cardId: number, isOnline: boolean) => void;
    registerCard: (cardId: number, ownerName?: string) => Promise<void>;
    unregisterCard: (cardId: number) => Promise<void>;
    getEstimatedBill: (cardId: number) => number;
    history: HistoryEvent[];
    clearHistory: () => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<BillingSettings>({
        gracePeriod: 10,
        penaltyRate: 0.1,
    });

    // Map of cardId -> Session Data
    const [cardSessions, setCardSessions] = useState<Record<number, CardSession>>({});

    // History of events
    const [history, setHistory] = useState<HistoryEvent[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedSettings = await AsyncStorage.getItem('billing_settings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
            const storedSessions = await AsyncStorage.getItem('card_sessions');
            if (storedSessions) {
                setCardSessions(JSON.parse(storedSessions));
            }
            const storedHistory = await AsyncStorage.getItem('billing_history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error('Failed to load billing data', e);
        }
    };

    const updateSettings = async (newSettings: Partial<BillingSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await AsyncStorage.setItem('billing_settings', JSON.stringify(updated));
    };

    const saveSessions = async (sessions: Record<number, CardSession>) => {
        setCardSessions(sessions);
        await AsyncStorage.setItem('card_sessions', JSON.stringify(sessions));
    };

    const addHistoryEvent = async (event: Omit<HistoryEvent, 'id'>) => {
        const newEvent: HistoryEvent = {
            ...event,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        const updatedHistory = [newEvent, ...history].slice(0, 100); // Keep last 100 events
        setHistory(updatedHistory);
        await AsyncStorage.setItem('billing_history', JSON.stringify(updatedHistory));
    };

    const clearHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem('billing_history');
    };

    const registerCard = async (cardId: number, ownerName?: string) => {
        const now = Date.now();
        const newSessions = {
            ...cardSessions,
            [cardId]: {
                cardId,
                ownerName,
                offlineSince: null,
                currentBill: 0,
            }
        };
        await saveSessions(newSessions);

        await addHistoryEvent({
            cardId,
            type: 'registered',
            timestamp: now,
        });
    };

    const unregisterCard = async (cardId: number) => {
        const newSessions = { ...cardSessions };
        delete newSessions[cardId];
        await saveSessions(newSessions);
    };

    const handleCardStatusChange = (cardId: number, isOnline: boolean) => {
        setCardSessions(prev => {
            const currentSession = prev[cardId];
            if (!currentSession) return prev; // Ignore status changes for unregistered cards

            if (isOnline) {
                // Card is now ONLINE (In Store)
                if (currentSession.offlineSince !== null) {
                    // It WAS offline, now it's back. End the session and record history.
                    const now = Date.now();
                    const durationMinutes = (now - currentSession.offlineSince) / 60000;
                    let penalty = 0;

                    if (durationMinutes > settings.gracePeriod) {
                        penalty = (durationMinutes - settings.gracePeriod) * settings.penaltyRate;
                    }

                    // Record the return event with penalty info
                    addHistoryEvent({
                        cardId,
                        type: 'returned',
                        timestamp: now,
                        penalty: penalty > 0 ? penalty : undefined,
                        durationMinutes,
                    });

                    const newSession = { ...currentSession, offlineSince: null };
                    const newSessions = { ...prev, [cardId]: newSession };
                    saveSessions(newSessions);
                    return newSessions;
                }
            } else {
                // Card is now OFFLINE (Outside)
                if (currentSession.offlineSince === null) {
                    // It WAS online, now it's gone. Start timer and record event.
                    const now = Date.now();

                    // Record the left event
                    addHistoryEvent({
                        cardId,
                        type: 'left',
                        timestamp: now,
                    });

                    const newSession = { ...currentSession, offlineSince: now };
                    const newSessions = { ...prev, [cardId]: newSession };
                    saveSessions(newSessions);
                    return newSessions;
                }
            }
            return prev;
        });
    };

    const getEstimatedBill = (cardId: number) => {
        const session = cardSessions[cardId];
        if (!session || !session.offlineSince) return 0;

        const now = Date.now();
        const durationMinutes = (now - session.offlineSince) / 60000;

        if (durationMinutes <= settings.gracePeriod) return 0;

        return (durationMinutes - settings.gracePeriod) * settings.penaltyRate;
    };

    return (
        <BillingContext.Provider value={{
            settings,
            updateSettings,
            cardSessions,
            handleCardStatusChange,
            registerCard,
            unregisterCard,
            getEstimatedBill,
            history,
            clearHistory
        }}>
            {children}
        </BillingContext.Provider>
    );
};

export const useBilling = () => {
    const context = useContext(BillingContext);
    if (!context) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
};
