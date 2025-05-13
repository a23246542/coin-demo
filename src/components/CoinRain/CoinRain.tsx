// 導入必要的依賴
import { useMemo, useState, useCallback } from "react";
import AwardWinningPlayer from "../AwardWinningPlayer";
import Coin from "./Coin";

// 導入型別
import { CoinRainProps, AwardPlayer } from "./types";

/**
 * 產生唯一識別符的輔助函式
 * 結合時間戳記與隨機數，確保在高頻重建場景中的唯一性
 * @returns 唯一識別符字串
 */
const generateUniqueId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

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
  // console.log("CoinRain", { count, resetAtSecond, showAwardPlayers });

  // 建立金幣種子陣列，管理每個金幣的唯一識別符
  const [coinSeeds, setCoinSeeds] = useState<string[]>(() =>
    Array.from({ length: count }, () => generateUniqueId())
  );

  // 金幣 CSS 動畫結束時的回調函式
  const handleCoinAnimationEnd = useCallback((index: number) => {
    setCoinSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[index] = generateUniqueId(); // 產生新種子，強制 React 重建組件
      return newSeeds;
    });
  }, []);

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
        left: `${Math.random() * 60 + 10}%`, // 20% 到 80% 之間隨機位置
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
      {/* 金幣雨 - 使用種子作為 key，每當種子變化時會重建金幣 */}
      {coinSeeds.map((seed, index) => (
        <Coin
          key={seed}
          resetAtSecond={resetAtSecond}
          onAnimationEnd={() => handleCoinAnimationEnd(index)}
        />
      ))}

      {/* 獲獎玩家 */}
      {showAwardPlayers &&
        mockAwardPlayers.map((player) => (
          <div
            key={`player-${player.id}`}
            className="award-player-animation absolute top-[-100px]"
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
