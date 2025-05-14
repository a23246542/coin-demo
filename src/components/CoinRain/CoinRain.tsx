// 導入必要的依賴
import React, { useMemo, useState, useCallback, useEffect } from "react"; // 引入 React
import AwardWinningPlayer from "../AwardWinningPlayer";
import Coin from "./Coin"; // 改為具名匯入
// import { Coin } from "./Coin"; // 確保 Coin.tsx 中 export const Coin

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
 * 為單個金幣產生隨機樣式 (此函式應與您先前版本中定義的保持一致)
 * @param index - 金幣的索引，可用於實現更均勻的分布
 * @param totalCoins - 金幣總數
 * @param delay - 控制是否套用初始動畫延遲。true (預設) 表示套用隨機延遲；false 表示立即開始（例如金幣重生時）
 * @returns React.CSSProperties 物件
 */
const generateCoinStyle = (
  index: number,
  totalCoins: number,
  delay: boolean = true
): React.CSSProperties => {
  // 金幣分布：85% 集中在中間區域，15% 分布於兩側
  const centralProbability = 0.85; // 85% 的金幣集中在中間區域
  const isCentralCoin = Math.random() < centralProbability;

  let calculatedLeftPercent: number;

  if (isCentralCoin) {
    // 中間區域 (10% - 70%)
    const minCentralPercent = 10;
    const maxCentralPercent = 70;
    const centralRangeWidth = maxCentralPercent - minCentralPercent;

    // 在中間區域均勻分布金幣
    const segmentWidth = centralRangeWidth / (totalCoins > 0 ? totalCoins : 1);
    const basePercentInCentralRange =
      minCentralPercent + segmentWidth * index * centralProbability;

    // 加入隨機偏移，讓分布更自然
    const randomOffset = (Math.random() - 0.5) * segmentWidth;
    calculatedLeftPercent = Math.max(
      minCentralPercent,
      Math.min(maxCentralPercent, basePercentInCentralRange + randomOffset)
    );
  } else {
    // 兩側區域
    const isLeftSide = Math.random() < 0.5;
    if (isLeftSide) {
      // 左側區域 (5% - 20%)
      calculatedLeftPercent = 5 + Math.random() * 15;
    } else {
      // 右側區域 (80% - 95%)
      calculatedLeftPercent = 80 + Math.random() * 15;
    }
  }

  const left = `${calculatedLeftPercent}%`;

  // 2. 動畫延遲 (animationDelay): 實現錯落有致的開始時間
  let animationDelay: string;
  if (delay) {
    // 對於第一批金幣，增加 randomDelayOffset 的範圍，使延遲分布更廣
    const baseDelayFactor = 0.05; // 降低基礎延遲因子，讓金幣分布更平均
    const baseDelay = (index % 15) * baseDelayFactor; // 擴大分組範圍

    // 隨機延遲與金幣總數掛鉤，提供更分散的開始時間
    const randomDelayOffset = Math.random() * (totalCoins * 0.15);
    animationDelay = `${baseDelay + randomDelayOffset}s`;
  } else {
    // 對於重生的金幣，不套用延遲，直接開始動畫
    animationDelay = "0s";
  }

  // 3. 動畫持續時間 (animationDuration): 金幣落下的速度
  // 擴大隨機範圍，使金幣在垂直方向的分布更加錯落有致
  const animationDuration = `${2.0 + Math.random() * 3.0}s`; // 2.0 到 5.0 秒

  // 4. 旋轉角度 (transform)
  const randomRotation = Math.random() * 360;
  const transform = `rotate(${randomRotation}deg)`;

  // 5. Z軸層級 (zIndex)
  const randomZIndex = Math.floor(Math.random() * 100);

  return {
    left,
    animationDelay,
    animationDuration,
    width: "140px",
    height: "140px",
    transform,
    zIndex: randomZIndex,
    // opacity: depthOpacity, // 如果需要深度感
  };
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

  // 建立金幣樣式陣列，預先產生每個金幣的樣式
  const [coinStyles, setCoinStyles] = useState<React.CSSProperties[]>(() =>
    Array.from({ length: count }, (_, i) => generateCoinStyle(i, count))
  );

  // 當金幣數量 (count prop) 改變時，重新初始化種子和樣式
  useEffect(() => {
    setCoinSeeds(Array.from({ length: count }, () => generateUniqueId()));
    setCoinStyles(
      Array.from({ length: count }, (_, i) => generateCoinStyle(i, count))
    );
  }, [count]);

  // 金幣 CSS 動畫結束時的回調函式
  const handleCoinAnimationEnd = useCallback(
    (index: number) => {
      // 更新特定索引的金幣種子，觸發該金幣的重建
      setCoinSeeds((prevSeeds) => {
        const newSeeds = [...prevSeeds];
        newSeeds[index] = generateUniqueId(); // 產生新種子
        return newSeeds;
      });
      // 同時更新該金幣的樣式，確保重生後的金幣有新的隨機樣式
      setCoinStyles((prevStyles) => {
        const newStyles = [...prevStyles];
        newStyles[index] = generateCoinStyle(index, count, false); // 為重生的金幣產生新樣式
        return newStyles;
      });
    },
    [count]
  ); // count 是 generateCoinStyle 的依賴

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
        // @ts-ignore TODO: 確保 CoinProps 中有 initialStyle 且類型正確 -> 已在 types.ts 中修正
        <Coin
          key={seed}
          initialStyle={coinStyles[index]} // 使用預先產生的樣式
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
