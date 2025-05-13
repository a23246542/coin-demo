import { useState } from "react";
import CoinRain from "./components/CoinRain";
// import CSS3DCoinRain from "./components/CSS3DCoinRain";
import "./App.css";
// 引入圖片
import jackpotBg from "./assets/JACKPOT.jpg";

function App() {
  const [showCoins, setShowCoins] = useState(false);
  const [showCSS3DCoins, setShowCSS3DCoins] = useState(false);
  const [coinCount, setCoinCount] = useState(30);
  const [resetTime, setResetTime] = useState(1.2);

  const handleCoinRain = () => {
    // 切換金幣雨的顯示狀態
    setShowCoins(true);
    setTimeout(() => {
      // setShowCoins(false);
    }, 8000);
  };

  // const handleCSS3DCoinRain = () => {
  //   // 切換 CSS 3D 金幣雨的顯示狀態
  //   setShowCSS3DCoins(true);
  //   setTimeout(() => {
  //     setShowCSS3DCoins(false);
  //   }, 8000);
  // };

  // 定義背景樣式
  const appStyle = showCoins
    ? {
        backgroundImage: `url(${jackpotBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      // className="App w-full max-w-[390px] mx-auto h-[844px] overflow-hidden  relative"
      className="App w-full mx-auto h-full overflow-hidden  relative"
      style={appStyle}
    >
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
      {!showCoins && (
        <div className="container flex flex-col items-center justify-start flex-1 w-full h-full text-[#f7b918] bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] overflow-auto px-4 py-6">
          <h1 className="text-lg mt-4 mb-3 text-[#f7b918] flex items-center justify-center gap-2 font-bold">
            金幣雨展示
          </h1>
          <p className="mb-8 text-base tracking-wide">
            {coinCount} 個金幣同時掉落的效果
          </p>

          <div className="p-8 max-w-[400px] bg-transparent flex flex-col items-center relative z-1 gap-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-24 mt-0 shadow-lg border border-white/[0.18] w-full mb-10">
              <div className="mb-8 text-left h-auto min-h-[80px] last:mb-0">
                <div className="flex justify-between items-center mb-4 h-[50px]">
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
                  className="w-full h-8 appearance-none bg-white/20 outline-none rounded-lg overflow-hidden"
                />
              </div>

              <div className="mb-8 text-left h-auto min-h-[80px] last:mb-0">
                <div className="flex justify-between items-center mb-4 h-[50px]">
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
                  className="w-full h-8 appearance-none bg-white/20 outline-none rounded-lg overflow-hidden"
                />
              </div>
            </div>

            {/* 按鈕區塊，間距與陰影效果調整 */}
            <div className="flex w-full justify-center gap-4">
              <button
                onClick={handleCoinRain}
                disabled={showCoins}
                className="bg-[#f7b918] text-black font-bold py-12 px-24 rounded-full cursor-pointer border-none text-base transition-all duration-200 shadow-[0_4px_16px_0_rgba(247,185,24,0.35)] hover:bg-[#ffd84a] hover:shadow-[0_8px_24px_0_rgba(247,185,24,0.45)] hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed min-w-[260px] mb-0"
                style={{ boxShadow: "0 6px 12px rgba(247,185,24,0.35)" }}
              >
                {showCoins ? "金幣雨落下中..." : "開始金幣雨"}
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
      )}
    </div>
  );
}

export default App;
