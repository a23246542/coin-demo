import { useState } from "react";
import CoinRain from "./components/CoinRain";
import CSS3DCoinRain from "./components/CSS3DCoinRain";
import "./App.css";

function App() {
  const [showCoins, setShowCoins] = useState(false);
  const [showCSS3DCoins, setShowCSS3DCoins] = useState(false);
  const [coinCount, setCoinCount] = useState(30);
  const [resetTime, setResetTime] = useState(2.1);

  const handleCoinRain = () => {
    // 切換金幣雨的顯示狀態
    setShowCoins(true);
    setTimeout(() => {
      setShowCoins(false);
    }, 8000);
  };

  const handleCSS3DCoinRain = () => {
    // 切換 CSS 3D 金幣雨的顯示狀態
    setShowCSS3DCoins(true);
    setTimeout(() => {
      setShowCSS3DCoins(false);
    }, 8000);
  };

  return (
    <>
      {showCoins && <CoinRain count={coinCount} resetAtSecond={resetTime} />}
      {/* {showCSS3DCoins && <CSS3DCoinRain count={coinCount} />} */}
      <div className="container">
        <h1>金幣雨 展示</h1>
        <p>{coinCount} 個金幣同時掉落的效果</p>

        <div className="card">
          <div className="control-panel">
            <div className="slider-container">
              <div className="slider-header">
                <label htmlFor="coin-count">金幣數量</label>
                <div className="value-display">{coinCount}</div>
              </div>
              <input
                id="coin-count"
                type="range"
                min="5"
                max="100"
                value={coinCount}
                onChange={(e) => setCoinCount(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="slider-container">
              <div className="slider-header">
                <label htmlFor="reset-time">動畫重置時間</label>
                <div className="value-display">{resetTime}秒</div>
              </div>
              <input
                id="reset-time"
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={resetTime}
                onChange={(e) => setResetTime(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={handleCoinRain}
              disabled={showCoins}
              className="start-button"
              style={{ flex: 1 }}
            >
              {showCoins ? "Lottie 金幣雨落下中..." : "開始 Lottie 金幣雨"}
            </button>

            {/* <button
              onClick={handleCSS3DCoinRain}
              disabled={showCSS3DCoins}
              className="start-button"
              style={{ flex: 1 }}
            >
              {showCSS3DCoins ? "CSS 3D 金幣雨落下中..." : "開始 CSS 3D 金幣雨"}
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
