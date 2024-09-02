import { createContext, useState } from "react";

/**
 * 検索に関するコンテキスト
 */
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [histories, setHistories] = useState([]);
  const [historiesCount, setHistoriesCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  return (
    <SearchContext.Provider
      value={{
        keyword,
        setKeyword,
        histories,
        setHistories,
        historiesCount,
        setHistoriesCount,
        inputValue,
        setInputValue,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * 削除に関するコンテキスト
 */
export const DeleteContext = createContext();

export const DeleteProvider = ({ children }) => {
  const [deletedCount, setDeletedCount] = useState(0);
  // deleteState: 0: waiting, 1: incomplete, 2: completed, 3: keyword is empty, 4: not found
  const [deleteState, setDeleteState] = useState(3);
  const [descriptionText, setDescriptionText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DeleteContext.Provider
      value={{
        deletedCount,
        setDeletedCount,
        deleteState,
        setDeleteState,
        descriptionText,
        setDescriptionText,
        isDeleting,
        setIsDeleting,
      }}>
      {children}
    </DeleteContext.Provider>
  );
};
