import { useContext } from "react"
import "./App.css"
import SearchBox from "./components/search_box";
import DeleteButton from "./components/delete_button";
import { SearchProvider, DeleteProvider, DeleteContext } from "./context";

export default function App() {
  return (
    <>
      <SearchProvider>
        <DeleteProvider>
          <Popup />
        </DeleteProvider>
      </SearchProvider>
    </>
  )
}

/**
 * 
 * @returns {JSX.Element} Main
 */
function Popup() {
  const { descriptionText } = useContext(DeleteContext);

  return (
    <>
      <SearchBox />
      <DeleteButton />
      {/* エスケープせずにHTMLを表示 */}
      <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
      {/* a hrefでchrome://history/に飛ぶとエラーが出るので、新規タブで開く */}
      <button onClick={() => chrome.tabs.create({ url: "chrome://history/" })}>
        検索履歴
      </button>
    </>
  )
}