// server-action-hooks/useJournalEntriesInfinite.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";
import { getJournalEntriesAction } from "@/server-actions/getJournalEntries";
import { ActionError } from "./types";

type Result<Q> = {
  pageParams: number[];
  pages: Q[];
};
type Return = JournalEntriesSelect[];

const useJournalEntriesInfinite = () => {
  return useInfiniteQuery<Return, ActionError, Result<Return>>({
    queryKey: ["journalEntries", "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getJournalEntriesAction({ limit: 10, offset: pageParam as number });
      if (!result) {
        throw new ActionError("No result returned");
      }
      if (result.serverError) {
        throw new ActionError(result.serverError.errorMessage);
      }
      if (!result.data) {
        throw new ActionError("Invalid data format");
      }
      return result.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length * 10;
    },
    initialPageParam: 0,
    placeholderData: (prev) => prev,
  });
};

export default useJournalEntriesInfinite;
