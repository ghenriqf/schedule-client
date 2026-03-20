import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ministryApi } from "@/features/ministry";
import type { MinistryDetailResponse } from "@/entities/ministry/model/types";

export function useMinistries() {
  const [search, setSearch] = useState("");

  const {
    data: ministries,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => ministryApi.list(),
  });

  const filtered: MinistryDetailResponse[] = (ministries ?? []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    ministries,
    filtered,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
  };
}
