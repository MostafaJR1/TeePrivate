"use client";

import { useEffect, useRef } from "react";
import { createClient as createLocalClient } from "@/utils/supabase/client";

export default function AuthSync() {
  const lastSyncRef = useRef({ accessToken: "", refreshToken: "" });

  useEffect(() => {
    const supabase = createLocalClient();

    let fifteenMinTimer: number | undefined = undefined;
    let sevenDayTimer: number | undefined = undefined;

    async function sendSessionToServer() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const accessToken = session.access_token;
        const refreshToken = session.refresh_token ?? "";

        if (
          accessToken === lastSyncRef.current.accessToken &&
          refreshToken === lastSyncRef.current.refreshToken
        ) {
          return;
        }

        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken || undefined,
            expires_at: session.expires_at,
          }),
          credentials: "same-origin",
        });

        if (response.ok) {
          lastSyncRef.current = { accessToken, refreshToken };
        }
      } catch {
        // ignore network or auth errors silently
      }
    }

    sendSessionToServer();
    fifteenMinTimer = window.setInterval(sendSessionToServer, 15 * 60 * 1000);
    sevenDayTimer = window.setInterval(sendSessionToServer, 7 * 24 * 60 * 60 * 1000);

    return () => {
      if (fifteenMinTimer) window.clearInterval(fifteenMinTimer);
      if (sevenDayTimer) window.clearInterval(sevenDayTimer);
    };
  }, []);

  return null;
}
