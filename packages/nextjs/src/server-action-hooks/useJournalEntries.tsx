// server-action-hooks/useJournalEntries.tsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJournalEntriesAction } from "@/server-actions/getJournalEntries";

const useJournalEntries = ({ limit = 10, offset = 0 }) => {
  return useQuery({
    queryKey: ["journalEntries", limit, offset],
    placeholderData: keepPreviousData,
    queryFn: () => getJournalEntriesAction({ limit, offset }),
  });
};

export default useJournalEntries;
