"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MINUTE = 1000 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      gcTime: 10 * MINUTE,
      staleTime: 10 * MINUTE,
      retry(failureCount, error) {
        if (isAxiosError(error) && error.response?.status === 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        buttonPosition={"bottom-left"}
        initialIsOpen={false}
      />
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};
export default Provider;
