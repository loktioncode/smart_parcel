import { useBilling } from '@/context/BillingContext';
import { useEffect, useState } from 'react';
import { fetchActiveCards } from '../app/services/EspApi';

export function usePresence(knownCardIds: number[] = []) {
    const [onlineCards, setOnlineCards] = useState<number[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const { handleCardStatusChange } = useBilling();

    useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            const cards = await fetchActiveCards();
            if (isMounted) {
                let currentOnlineIds: number[] = [];
                if (cards.length > 0) {
                    currentOnlineIds = cards.map(c => c.id);
                    setOnlineCards(currentOnlineIds);
                    setIsConnected(true);
                } else {
                    setOnlineCards([]);
                    // We assume disconnected if simple fetch fails, but fetchActiveCards returns [] on error. 
                    // We might need a better "connected" check, but this is fine for now.
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

    return { onlineCards, lastUpdated, isConnected };
}
