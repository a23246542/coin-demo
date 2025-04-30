// 導入必要的依賴
import { useMemo } from "react";
import AwardWinningPlayer from "../AwardWinningPlayer";
import Coin from "./Coin";

// 導入型別
import { CoinRainProps, AwardPlayer } from "./types";

/**
 * 主要金幣雨組件
 *
 * @param count 金幣數量
 * @param resetAtSecond 在第幾秒重頭播放
 * @param showAwardPlayers 是否顯示獲獎玩家，預設為 true
 */
export const CoinRain = ({
  count = 30,
  resetAtSecond,
  showAwardPlayers = true,
}: CoinRainProps) => {
  console.log("CoinRain", { count, resetAtSecond, showAwardPlayers });

  // 使用 useMemo 產生獲獎玩家假資料
  const mockAwardPlayers = useMemo<AwardPlayer[]>(() => {
    const angles = [-30, -15, 0, 15, 30]; // 不同傾斜角度
    const avatars = [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      avatarUrl: avatars[i],
      amount: Math.floor(Math.random() * 500) + 100,
      style: {
        position: "absolute" as const,
        left: `${Math.random() * 60 + 20}%`, // 20% 到 80% 之間隨機位置
        // top: "-100px",
        // transform: `rotate(${angles[i]}deg)`, // 只保留旋轉角度
        "--rotate-angle-start": `${angles[i]}deg`,
        "--rotate-angle-end": `${angles[i]}deg`,
        opacity: 1,
        zIndex: 100,
        // transition: "all 0.3s ease-in-out", // 新增 transition 屬性
        // animationDelay: `${0.5 + Math.random() * 1}s`, // 隨機延遲開始 (0.5-1.5秒)
        animationDelay: `${1 + Math.random() * 2}s`, // 隨機延遲開始 (0.5-1.5秒)
        // animationDuration: `${5 + Math.random() * 2}s`, // 隨機落下時間 (5-7秒)
        // animationDuration: `${4 + Math.random() * 2}s`, // 隨機落下時間 (5-7秒)
        animationDuration: `${4}s`, // 隨機落下時間 (5-7秒)
        // animationTimingFunction: "cubic-bezier(0.6, 0.01, 0.4, 0.99)", // 前後快中間更慢的時間函數
        animationTimingFunction: "cubic-bezier(0.6, 0.4, 1, 0.1)", // 前後快中間更慢的時間函數
        // animationTimingFunction: "cubic-bezier(.54,.035,1,.1)", // 前後快中間更慢的時間函數
        // animationTimingFunction: "cubic-bezier(0.6, 0.2, 0.9, 0.6)", // 前後快中間更慢的時間函數
        // animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)", // 前後快中間更慢的時間函數
      },
    }));
  }, []); // 空依賴數組，只在組件初始化時建立一次

  return (
    <div className="coin-rain-container fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
      {/* 金幣雨 */}
      {Array.from({ length: count }).map((_, index) => (
        <Coin key={`coin-${index}`} resetAtSecond={resetAtSecond} />
      ))}

      {/* 獲獎玩家 */}
      {showAwardPlayers &&
        mockAwardPlayers.map((player) => (
          <div
            key={`player-${player.id}`}
            // className="award-player-animation absolute top-[-100px]"
            className="award-player-animation absolute top-[-100px]"
            // className="absolute top-0"
            style={player.style}
          >
            <AwardWinningPlayer
              avatarUrl={player.avatarUrl}
              amount={player.amount}
              className="custom-class"
            />
          </div>
        ))}
    </div>
  );
};

export default CoinRain;
