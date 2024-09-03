import { createContext, useState } from "react";

/**
 * 検索に関するコンテキスト
 */
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");

  return (
    <SearchContext.Provider
      value={{
        keyword,
        setKeyword,
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
  // deleteState: 0: waiting, 1: completed, 2: keyword is empty, 3: not found
  const [deleteState, setDeleteState] = useState(3);
  const [descriptionText, setDescriptionText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DeleteContext.Provider
      value={{
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
