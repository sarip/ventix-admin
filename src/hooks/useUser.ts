import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // npm install js-cookie

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userData = Cookies.get("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading };
}
