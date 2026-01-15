import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { NotificationMessage } from "@/types/notification";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

export default function useRealtimeNotification(
    userId: number | null,
    onReceive: (data: NotificationMessage) => void
) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        console.log("Connecting to WebSocket as user:", userId);

        const newSocket: Socket = io(WS_URL, {
            query: { userId: String(userId) }
        });

        newSocket.on("connect", () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        });

        // Event handlers for all notification types
        const handleEvent = (data: NotificationMessage) => {
            console.log("Received notification:", data);
            onReceive(data);
        };

        // Subscribe to all notification channels
        newSocket.on("alert", handleEvent);
        newSocket.on("pm:due", handleEvent);
        newSocket.on("pm:approval_needed", handleEvent);
        newSocket.on("wo:assigned", handleEvent);
        newSocket.on("wo:overdue", handleEvent);
        newSocket.on("wo:status_changed", handleEvent);
        newSocket.on("wo:completed", handleEvent);
        newSocket.on("ticket:created", handleEvent);
        newSocket.on("sla:breach", handleEvent);
        newSocket.on("sla:warning", handleEvent);
        newSocket.on("escalation:triggered", handleEvent);
        newSocket.on("incident:alert", handleEvent);
        newSocket.on("inventory:low_stock", handleEvent);
        newSocket.on("vendor:contract_expiry", handleEvent);
        newSocket.on("invoice:overdue", handleEvent);

        setSocket(newSocket);

        return () => {
            console.log("Disconnecting WebSocket");
            newSocket.disconnect();
        };
    }, [userId, onReceive]);

    return { socket, isConnected };
}
