import { useBilling } from '@/context/BillingContext';
import { useEffect, useState } from 'react';
import { fetchActiveCards } from '../services/EspApi';

export function usePresence(knownCardIds: number[] = []) {
    const [onlineCards, setOnlineCards] = useState<number[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    const { handleCardStatusChange } = useBilling();

    useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            const result = await fetchActiveCards();
            if (isMounted) {
                let currentOnlineIds: number[] = [];

                setIsConnected(result.isConnected);
                setIsOfflineMode(result.isOfflineMode);

                if (result.cards.length > 0) {
                    // Filter cards that were seen recently (within 60 seconds)
                    // AND ensure they are part of our known card list
                    currentOnlineIds = result.cards
                        .filter(c => c.last_seen_ms_ago < 60000)
                        .map(c => c.id)
                        .filter(id => knownCardIds.includes(id));
                    setOnlineCards(currentOnlineIds);
                } else {
                    setOnlineCards([]);
                }
                setLastUpdated(new Date());

                // Sync with Billing Context
                // Verify status for ALL known cards
                knownCardIds.forEach(id => {
                    const isOnline = currentOnlineIds.includes(id);
                    handleCardStatusChange(id, isOnline);
                });
            }
        }, 2000); // Poll every 2 seconds

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [knownCardIds, handleCardStatusChange]); // Re-run if knownIds change (unlikely)

    return { onlineCards, lastUpdated, isConnected, isOfflineMode };
}
