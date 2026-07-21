"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/ToastContainer";

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const { data: session } = authClient.useSession();
    const { addToast } = useToast();

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
        });

        socketInstance.on("connect", () => {
            setConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Register user ID when session changes
    useEffect(() => {
        if (socket && session?.user?.id) {
            socket.emit("register_user", session.user.id);

            const handleNotification = (notif: { title: string; message: string; link?: string }) => {
                addToast({
                    title: notif.title,
                    message: notif.message,
                    link: notif.link,
                });
            };

            socket.on("notification", handleNotification);

            return () => {
                socket.off("notification", handleNotification);
            };
        }
    }, [socket, session?.user?.id, addToast]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
