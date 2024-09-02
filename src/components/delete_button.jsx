import { useCallback, useEffect, useContext, useRef } from "react";
import useDeleteHistories from "../hooks/use_delete_histories";
import useFetchHistories from "../hooks/use_fetch_histories";
import { DeleteContext } from "../context";

/**
 * 削除ボタン
 * @returns {JSX.Element} button
 */
const DeleteButton = () => {
  const {
    isDeleting,
    setIsDeleting,
  } = useContext(DeleteContext);

  const fetchHistories = useFetchHistories();
  const abortControllerRef = useRef(null);
  const handleDelete = useDeleteHistories(abortControllerRef);

  /**
   * 削除ボタンが押された時の処理
   * @returns {void}
   */
  const handleClick = useCallback(() => {
    setIsDeleting(!isDeleting);
  }, [isDeleting, setIsDeleting]);

  // isDeletingがtrueに変更されたらhandleDeleteを呼び出す
  useEffect(() => {
    if (isDeleting) {
      handleDelete();
    }
  }, [handleDelete, isDeleting]);

  // 削除が完了したら、履歴を再取得し、表示を更新する
  useEffect(() => {
    if (!isDeleting && abortControllerRef.current) {
      fetchHistories();
    }
  }, [isDeleting, fetchHistories]);

  return (
    <>
      <button onClick={handleClick}>
        {isDeleting ? "中止" : "削除"}
      </button>
    </>
  )
}

export default DeleteButton;