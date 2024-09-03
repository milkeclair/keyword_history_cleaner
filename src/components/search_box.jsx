import { useEffect, useContext } from "react";
import useFetchHistories from "../hooks/use_fetch_histories";
import { SearchContext, DeleteContext } from "../context";

/**
 * 検索ボックス
 * @returns {JSX.Element} input
 */
const SearchBox = () => {
  const { inputValue, setInputValue, setKeyword } = useContext(SearchContext);
  const { isDeleting } = useContext(DeleteContext);
  const fetchHistories = useFetchHistories();

  // 連続して入力された時に、頻繁にfetchHistoriesが呼ばれるのを防ぐ
  useEffect(() => {
    const timeout = setTimeout(() => {
      setKeyword(inputValue);
    }, 300);

    // useEffectでのreturnはcleanup
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue, setKeyword]);

  // 検索するキーワードが変更されたら、履歴を検索する
  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  return (
    <>
      <input 
        type="text"
        placeholder="キーワードを入力"
        value={inputValue} 
        onChange={(event) => setInputValue(event.target.value)}
        disabled={isDeleting}
      />
    </>
  )
}

export default SearchBox;