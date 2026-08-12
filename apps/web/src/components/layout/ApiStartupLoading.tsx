'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Spinner } from '@/components/ui/spinner';

const API_STARTUP_LOADING_DELAY_MS = 5_000;

export function ApiStartupLoading({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [showStartupMessage, setShowStartupMessage] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setShowStartupMessage(true),
      API_STARTUP_LOADING_DELAY_MS
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Box display="flex" direction="column" gap="lg">
      {showStartupMessage ? (
        <Box
          aria-live="polite"
          surface="highlight"
          display="flex"
          align="center"
          gap="md"
          className="px-4 py-3 sm:px-5"
        >
          <Spinner className="size-5 shrink-0" />
          <Box display="flex" direction="column" gap="xs">
            <Typography as="p" variant="bodySm" weight="semibold">
              サーバーを起動しています
            </Typography>
            <Typography as="p" variant="caption" tone="muted">
              しばらくお待ちください。接続できるまで自動で再試行します。
            </Typography>
          </Box>
        </Box>
      ) : null}
      {children}
    </Box>
  );
}
