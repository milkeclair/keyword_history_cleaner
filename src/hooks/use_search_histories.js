import { useCallback, useContext } from "react";
import { SearchContext } from "../context";

/**
 * 履歴を検索する
 * @returns {Promise} 検索結果
 */
const useSearchHistories = () => {
  const { keyword } = useContext(SearchContext);

  /**
   * 履歴を検索する
   * @returns {Promise} 検索結果
   */
  const searchHistories = useCallback(() => {
    return new Promise((resolve) => {
      const yearToMilliseconds = 1000 * 60 * 60 * 24 * 365;
      const tenYearsAgo = new Date().getTime() - yearToMilliseconds * 10;
      chrome.history.search(
        { text: keyword, startTime: tenYearsAgo, maxResults: 50 },
        (histories) => {
          resolve(histories);
        }
      );
    });
  }, [keyword]);

  return searchHistories;
};

export default useSearchHistories;
