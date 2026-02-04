import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BillingSettings {
    gracePeriod: number; // minutes
    penaltyRate: number; // dollars per minute
}

interface CardSession {
    cardId: number;
    offlineSince: number | null; // Timestamp (ms) when card went offline. Null if online.
    currentBill: number; // Accumulated bill for CLOSED sessions (if we want history), or just transient?
    // Actually, for "current status", we just need offlineSince.
}

interface BillingContextType {
    settings: BillingSettings;
    updateSettings: (newSettings: Partial<BillingSettings>) => Promise<void>;
    cardSessions: Record<number, CardSession>;
    handleCardStatusChange: (cardId: number, isOnline: boolean) => void;
    getEstimatedBill: (cardId: number) => number;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<BillingSettings>({
        gracePeriod: 10,
        penaltyRate: 0.1,
    });

    // Map of cardId -> Session Data
    const [cardSessions, setCardSessions] = useState<Record<number, CardSession>>({});

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

    const handleCardStatusChange = (cardId: number, isOnline: boolean) => {
        setCardSessions(prev => {
            const currentSession = prev[cardId] || { cardId, offlineSince: null, currentBill: 0 };

            // If status hasn't logically changed (e.g. still online), do nothing
            // But we need to be careful. The hook calls this often.
            // We rely on the hook to only call this on CHANGE or we define idempotency here.
            // Let's assume the hook might call it repeatedly, so we check state.

            if (isOnline) {
                // Card is now ONLINE (In Store)
                if (currentSession.offlineSince !== null) {
                    // It WAS offline, now it's back. End the session.
                    // Calculate final bill and add to history (omitted for now, just clearing offline status)
                    // Or we could keep 'currentBill' accumulating?
                    // For this MVP, let's just reset "offlineSince" to null.
                    const newSession = { ...currentSession, offlineSince: null };
                    const newSessions = { ...prev, [cardId]: newSession };
                    saveSessions(newSessions);
                    return newSessions;
                }
            } else {
                // Card is now OFFLINE (Outside)
                if (currentSession.offlineSince === null) {
                    // It WAS online, now it's gone. Start timer.
                    const newSession = { ...currentSession, offlineSince: Date.now() };
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
        <BillingContext.Provider value={{ settings, updateSettings, cardSessions, handleCardStatusChange, getEstimatedBill }}>
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
