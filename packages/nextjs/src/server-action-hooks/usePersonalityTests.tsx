// server-action-hooks/usePersonalityTests.tsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPersonalityTestsAction } from "@/server-actions/getPersonalityTests";

const usePersonalityTests = ({ limit = 10, offset = 0 }) => {
  return useQuery({
    queryKey: ["personalityTests", limit, offset],
    placeholderData: keepPreviousData,
    queryFn: () => getPersonalityTestsAction({ limit, offset }),
  });
};

export default usePersonalityTests;
