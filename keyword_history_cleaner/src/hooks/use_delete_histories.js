import { useCallback, useContext, useEffect } from "react";
import useSearchHistories from "./use_search_histories";
import { SearchContext, DeleteContext } from "../context";

/**
 * 履歴を削除する
 * @param {object} abortControllerRef
 * @returns {function} handleDelete
 */
const useDeleteHistories = (abortControllerRef) => {
  const {
    keyword,
    histories,
    historiesCount,
    setHistories,
    setHistoriesCount,
  } = useContext(SearchContext);

  const {
    deletedCount,
    setDeletedCount,
    deleteState,
    setDeleteState,
    isDeleting,
    setIsDeleting,
    setDescriptionText,
  } = useContext(DeleteContext);

  const searchHistories = useSearchHistories();

  /**
   * 履歴を削除する
   * @param {array} histories
   * @returns {Promise} 削除した履歴の数
   */
  const deleteHistories = useCallback(
    (histories) => {
      return new Promise((resolve, reject) => {
        let count = 0;
        for (const history of histories) {
          if (!isDeleting) {
            reject(new Error("削除が中断されました"));
            return;
          }
          chrome.history.deleteUrl({ url: history.url });
          count++;
        }
        resolve(count);
      });
    },
    [histories, isDeleting]
  );

  /**
   * deleteStateに応じて、検索バーの下に表示するテキストを返す
   * @param {enum} deleteState
   * @param {number} deletedCount
   * @returns {string} テキスト
   */
  const handleDescriptionText = useCallback((deleteState, deletedCount) => {
    switch (deleteState) {
      case 0:
        return "削除ボタンを押すと検索履歴が削除されます";
      case 1:
        return `${deletedCount}件の履歴を削除中...`;
      case 2:
        return `${deletedCount}件の履歴を削除しました`;
      case 3:
        return "キーワードが入力されていない場合、<br />全ての履歴が削除されます";
      case 4:
        return "検索履歴が見つかりませんでした";
    }
  }, []);

  /**
   * 削除ボタンが押された時の処理
   * 履歴が0件になるまで削除を繰り返す
   * 削除の状態に応じてdeleteStateを更新
   * @returns {Promise<void>}
   */
  const handleDelete = useCallback(async () => {
    setDeleteState(1);
    setDeletedCount(0);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    while (historiesCount > 0 && isDeleting) {
      try {
        if (signal.aborted) {
          throw new Error("削除が中断されました");
        }

        const resultCount = await deleteHistories(histories);
        setDeletedCount((prevCount) => prevCount + resultCount);

        const results = await searchHistories(keyword);
        setHistories(results);
        setHistoriesCount(results.length);

        if (results.length === 0) {
          setDeleteState(2);
          break;
        }
      } catch (error) {
        setDeleteState(2);
        break;
      }
    }

    setHistories([]);
    setIsDeleting(false);
  }, [
    histories,
    historiesCount,
    keyword,
    setHistories,
    setHistoriesCount,
    deletedCount,
    setDeletedCount,
    setDeleteState,
    isDeleting,
    setIsDeleting,
    setDescriptionText,
  ]);

  useEffect(() => {
    setDescriptionText(handleDescriptionText(deleteState, deletedCount));
  }, [deleteState, deletedCount, setDescriptionText, handleDescriptionText]);

  return handleDelete;
};

export default useDeleteHistories;
