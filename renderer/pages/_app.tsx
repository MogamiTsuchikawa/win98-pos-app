import "../../node_modules/98.css/dist/98.css";
import "../style/reset.css";
import "../style/window.css";
import WindowBar from "../components/Window/WindowBar";
import { RecoilRoot } from "recoil";

const App = ({ Component, pageProps }) => {
  const windowStyle = {
    height: "100%",
  };
  const bodyStyle = {
    width: "calc(100% - 5px)",
    height: "calc(100vh - 45px)",
  };
  return (
    <div className="window" style={windowStyle}>
      <WindowBar title="hello" />
      <div className="window-body" style={bodyStyle}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </div>
    </div>
  );
};

export default App;
