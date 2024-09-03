import { useCallback, useContext, useEffect, useRef } from "react";
import { SearchContext, DeleteContext } from "../context";
import useSearchHistories from "./use_search_histories";

/**
 * 履歴を削除する
 * @param {object} abortControllerRef
 * @returns {function} handleDelete
 */
const useDeleteHistories = (abortControllerRef) => {
  const { historiesCount, setHistories, setHistoriesCount } =
    useContext(SearchContext);
  const {
    deleteState,
    setDeleteState,
    isDeleting,
    setIsDeleting,
    setDescriptionText,
  } = useContext(DeleteContext);
  const searchHistories = useSearchHistories();
  const deletedCountRef = useRef(0);

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
        return `${deletedCount}件の履歴を削除しました`;
      case 2:
        return "未入力の場合、全ての履歴が削除されます";
      case 3:
        return "検索履歴が見つかりませんでした";
    }
  }, []);

  /**
   * deleteStateに応じて、検索バーの下に表示するテキストを更新する
   */
  const updateDescriptionText = useCallback(() => {
    setDescriptionText(
      handleDescriptionText(deleteState, deletedCountRef.current)
    );
  }, [deleteState, setDescriptionText, handleDescriptionText]);

  /**
   * 履歴を削除する
   * @param {array} historiesToDelete
   * @returns {Promise<void>}
   */
  const deleteHistories = useCallback(
    async (historiesToDelete) => {
      const deleteProcesses = historiesToDelete.map((history) => {
        if (!isDeleting) {
          throw new Error("削除が中断されました");
        }
        return new Promise((resolve) => {
          chrome.history.deleteUrl({ url: history.url }, () => {
            deletedCountRef.current += 1;
            resolve();
          });
        });
      });

      // forよりPromise.allの方が早い
      await Promise.all(deleteProcesses);
    },
    [isDeleting]
  );

  /**
   * 削除ボタンが押された時の処理
   * 履歴が0件になるまで削除を繰り返す
   * @returns {Promise<void>}
   */
  const handleDelete = useCallback(async () => {
    setDeleteState(1);
    abortControllerRef.current = new AbortController();

    while (historiesCount > 0 && isDeleting) {
      try {
        // 早期リターン
        if (abortControllerRef.current.signal.aborted) {
          throw new Error();
        }
        const searchResults = await searchHistories();
        setHistoriesCount(searchResults.length);
        if (historiesCount === 0) {
          break;
        }

        await deleteHistories(searchResults);
      } catch {
        break;
      }
    }
    // 初期化
    if (abortControllerRef.current && abortControllerRef.current.signal) {
      abortControllerRef.current.abort();
    }
    setHistories([]);
    setIsDeleting(false);
    deletedCountRef.current = 0;
  }, [
    setDeleteState,
    abortControllerRef,
    historiesCount,
    isDeleting,
    setHistories,
    setIsDeleting,
    searchHistories,
    setHistoriesCount,
    deleteHistories,
  ]);

  // 削除がトリガーされたら、100msごとに削除数の表示を更新する
  // 初回はちらつくので、setTimeoutで遅延
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateDescriptionText();
    }, 100);
    const intervalId = setInterval(updateDescriptionText, 100);

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalId);
    };
  }, [updateDescriptionText]);

  return handleDelete;
};

export default useDeleteHistories;
