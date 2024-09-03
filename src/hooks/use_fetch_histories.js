import { useCallback, useContext } from "react";
import useSearchHistories from "./use_search_histories";
import { SearchContext, DeleteContext } from "../context";

/**
 * 履歴を検索する
 * @returns {function} fetchHistories
 */
const useFetchHistories = () => {
  const { keyword, setHistories, setHistoriesCount } =
    useContext(SearchContext);
  const { setDeleteState } = useContext(DeleteContext);
  const searchHistories = useSearchHistories();

  /**
   * 履歴を検索して、deleteStateを更新する
   * @returns {Promise<void>}
   */
  const fetchHistories = useCallback(async () => {
    const results = await searchHistories();
    setHistories(results);
    setHistoriesCount(results.length);

    // 検索結果に応じてdeleteStateを更新
    if (results.length === 0) {
      setDeleteState(3);
    } else if (keyword === "") {
      setDeleteState(2);
    } else {
      setDeleteState(0);
    }
  }, [
    searchHistories,
    setHistories,
    setHistoriesCount,
    setDeleteState,
    keyword,
  ]);

  return fetchHistories;
};

export default useFetchHistories;
