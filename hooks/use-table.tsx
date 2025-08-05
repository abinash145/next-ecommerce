import { useEffect, useMemo, useState } from "react";

import { debounce } from "lodash";
import { useQueryState } from "nuqs";

export const useTableState = () => {
  const [page, setPageRaw] = useQueryState("page", {
    defaultValue: "1",
  });
  const [perPage, setPerPageRaw] = useQueryState("perPage", {
    defaultValue: "10",
  });
  const [search, setSearchRaw] = useQueryState("search", {
    defaultValue: "",
  });
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounced version of setPageRaw
  const setPage = useMemo(
    () =>
      debounce((value: number | string) => {
        setPageRaw(String(value));
      }, 300),
    [setPageRaw]
  );

  // Debounced version of setSearchRaw
  const setSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchRaw(value);
      }, 300),
    [setSearchRaw]
  );
  const setPerPage = useMemo(
    () =>
      debounce((value: number | string) => {
        setPerPageRaw(String(value));
      }, 300),
    [setPerPageRaw]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setPage.cancel();
      setSearch.cancel();
    };
  }, [setPage, setSearch]);
  const handlePaginationFromApi = (pagination: any) => {
    const { totalPages: apiTotalPage, totalCount: apiTotalCount } = pagination;

    setTotalPage(apiTotalPage);
    setTotalCount(apiTotalCount);
  };
  return {
    page,
    setPage,
    search,
    setSearch,
    totalPage,
    setTotalPage,
    setPerPage,
    perPage,
    totalCount,
    setTotalCount,
    handlePaginationFromApi,
  };
};
