import { useCallback, useEffect, useContext, useRef } from "react";
import useDeleteHistories from "../hooks/use_delete_histories";
import useFetchHistories from "../hooks/use_fetch_histories";
import { DeleteContext } from "../context";

/**
 * 削除ボタン
 * @returns {JSX.Element} button
 */
const DeleteButton = () => {
  const { isDeleting, setIsDeleting } = useContext(DeleteContext);
  const abortControllerRef = useRef(null);
  const handleDelete = useDeleteHistories(abortControllerRef);
  const fetchHistories = useFetchHistories();

  /**
   * 削除ボタンが押された時の処理
   * @returns {void}
   */
  const handleClick = useCallback(() => {
    setIsDeleting(!isDeleting);
  }, [isDeleting, setIsDeleting]);

  // 削除中フラグがtrueになったら、削除処理を実行する
  // falseになったら、初期化してビューを更新
  useEffect(() => {
    async function deleteProcess() {
      if (isDeleting) {
        await handleDelete();
      } else if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
    deleteProcess();

    if (!isDeleting) {
      fetchHistories();
    }
  // depsにhandleDeleteを追加すると無限ループする
  }, [isDeleting]);

  return (
    <>
      <button onClick={handleClick}>
        {isDeleting ? "中止" : "削除"}
      </button>
    </>
  )
}

export default DeleteButton;