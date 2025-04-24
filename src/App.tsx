import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import CoinRain from "./components/CoinRain";
import "./App.css";

function App() {
  const [showCoins, setShowCoins] = useState(false);

  const handleCoinRain = () => {
    // 切換金幣雨的顯示狀態
    setShowCoins(true);
    // 8秒後停止金幣雨
    setTimeout(() => {
      setShowCoins(false);
    }, 15000);
  };

  return (
    <>
      {showCoins && <CoinRain count={20} resetAtSecond={2} />}
      <div className="container">
        {/* <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div> */}
        {/* <h1>金幣雨展示</h1> */}
        <div className="card">
          <button onClick={handleCoinRain} disabled={showCoins}>
            {showCoins ? "金幣雨落下中..." : "開始金幣雨"}
          </button>
          <p>點擊按鈕啟動金幣雨效果</p>
        </div>
        <p className="read-the-docs">
          使用 React、TypeScript 和 Lottie 動畫製作
        </p>
      </div>
    </>
  );
}

export default App;
