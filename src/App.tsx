import { useState } from "react";
import CoinRain from "./components/CoinRain";
// import CSS3DCoinRain from "./components/CSS3DCoinRain";
import "./App.css";

function App() {
  const [showCoins, setShowCoins] = useState(false);
  const [showCSS3DCoins, setShowCSS3DCoins] = useState(false);
  const [coinCount, setCoinCount] = useState(30);
  const [resetTime, setResetTime] = useState(1.2);

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
    <div className="App">
      {showCoins && (
        <CoinRain
          count={coinCount}
          resetAtSecond={resetTime}
          showAwardPlayers={true}
        />
      )}

      {/* <AwardWinningPlayer
        avatarUrl="https://i.pravatar.cc/150?img=1"
        amount={100}
        className="custom-class"
      /> */}
      <div className="container flex flex-col items-center justify-center flex-1 w-full relative min-h-[600px] text-[#f7b918] bg-transparent overflow-auto">
        <h1 className="text-2xl mb-2 text-[#f7b918] shadow-md flex items-center justify-center gap-2">
          金幣雨 展示
        </h1>
        <p>{coinCount} 個金幣同時掉落的效果</p>

        <div className="p-8 max-w-[500px] bg-transparent flex flex-col items-center relative z-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-4 shadow-lg border border-white/[0.18] w-full mb-6">
            <div className="mb-6 text-left h-auto min-h-[80px] last:mb-0">
              <div className="flex justify-between items-center mb-3 h-[50px]">
                <label htmlFor="coin-count" className="text-base text-white">
                  金幣數量
                </label>
                <div className="bg-[#f7b918]/20 rounded-full w-[50px] h-[50px] flex items-center justify-center text-[1.1rem] font-bold text-[#f7b918] ml-[15px] border-2 border-[#f7b918]/40 flex-shrink-0">
                  {coinCount}
                </div>
              </div>
              <input
                id="coin-count"
                type="range"
                min="5"
                max="100"
                value={coinCount}
                onChange={(e) => setCoinCount(Number(e.target.value))}
                className="w-full h-2 appearance-none bg-white/20 outline-none rounded-lg overflow-hidden"
              />
            </div>

            <div className="mb-6 text-left h-auto min-h-[80px] last:mb-0">
              <div className="flex justify-between items-center mb-3 h-[50px]">
                <label htmlFor="reset-time" className="text-base text-white">
                  動畫重置時間
                </label>
                <div className="bg-[#f7b918]/20 rounded-full w-[50px] h-[50px] flex items-center justify-center text-[1.1rem] font-bold text-[#f7b918] ml-[15px] border-2 border-[#f7b918]/40 flex-shrink-0">
                  {resetTime}秒
                </div>
              </div>
              <input
                id="reset-time"
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={resetTime}
                onChange={(e) => setResetTime(Number(e.target.value))}
                className="w-full h-2 appearance-none bg-white/20 outline-none rounded-lg overflow-hidden"
              />
            </div>
          </div>

          <div className="flex gap-[10px] mb-[10px]">
            <button
              onClick={handleCoinRain}
              disabled={showCoins}
              className="bg-[#f7b918] text-black font-bold py-3 px-6 rounded-full cursor-pointer border-none text-base transition-all duration-300 shadow-md hover:bg-[#ffcc33] hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full max-w-[250px] flex-1"
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
    </div>
  );
}

export default App;
