import { useEffect, useContext } from "react";
import useFetchHistories from "../hooks/use_fetch_histories";
import { SearchContext, DeleteContext } from "../context";

/**
 * 検索ボックス
 * @returns {JSX.Element} input
 */
const SearchBox = () => {
  const { inputValue, setInputValue, setKeyword } = useContext(SearchContext);

  const { setDeletedCount } = useContext(DeleteContext);
  const fetchHistories = useFetchHistories();

  // 連続して入力された時に、頻繁にfetchHistoriesが呼ばれるのを防ぐ
  useEffect(() => {
    const timeout = setTimeout(() => {
      setKeyword(inputValue);
      console.log("setKeyword");
    }, 300);

    // useEffectでのreturnはcleanup
    // cleanupは次のeffectが実行される前に実行される
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue, setKeyword]);

  // 検索するキーワードが変更されたら、履歴を検索する
  useEffect(() => {
    setDeletedCount(0);
    fetchHistories();
  }, [fetchHistories, setDeletedCount]);

  return (
    <>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(event) => setInputValue(event.target.value)}
      />
    </>
  )
}

export default SearchBox;