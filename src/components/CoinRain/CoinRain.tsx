// 導入必要的依賴
import React, { useMemo, useState, useCallback, useEffect } from "react"; // 引入 React
import AwardWinningPlayer from "../AwardWinningPlayer";
import Coin from "./Coin"; // 從 Coin 資料夾引入 - 改為資料夾匯入

// 導入型別
import { CoinAnimationSpeed, CoinSize } from "./Coin/types";
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
 * 為單個金幣產生隨機樣式
 * @param index - 金幣的索引，用於實現更均勻的分布
 * @param totalCoins - 金幣總數
 * @param delay - 控制是否套用初始動畫延遲。true (預設) 表示套用隨機延遲；false 表示立即開始（例如金幣重生時）
 * @returns 金幣的 CSS 樣式物件
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
    // width: "140px",
    // height: "140px",
    transform,
    zIndex: randomZIndex,
    // opacity: depthOpacity, // 如果需要深度感
  };
};

/**
 * 產生平均分配的金幣動畫速度陣列
 *
 * @param count 需要產生的速度陣列長度
 * @param randomize 是否隨機排列速度（預設為 false，按順序平均分配）
 * @returns 包含平均分配的動畫速度陣列
 */
const generateDistributedSpeeds = (
  count: number,
  randomize: boolean = false
): CoinAnimationSpeed[] => {
  // 建立三種速度類型的均勻分配
  const speeds: CoinAnimationSpeed[] = [];

  // 計算每種速度應該有多少個
  const fastCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const slowCount = count - fastCount - mediumCount; // 確保總數等於 count

  // 填充速度陣列
  speeds.push(...Array(fastCount).fill(CoinAnimationSpeed.Fast));
  speeds.push(...Array(mediumCount).fill(CoinAnimationSpeed.Medium));
  speeds.push(...Array(slowCount).fill(CoinAnimationSpeed.Slow));

  // 如果需要隨機排列，使用 Fisher-Yates 洗牌演算法
  if (randomize && count > 1) {
    for (let i = speeds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [speeds[i], speeds[j]] = [speeds[j], speeds[i]]; // 交換元素
    }
  }

  return speeds;
};

/**
 * 產生平均分配的金幣尺寸陣列
 *
 * @param count 需要產生的尺寸陣列長度
 * @param randomize 是否隨機排列尺寸（預設為 false，按順序平均分配）
 * @returns 包含平均分配的金幣尺寸陣列
 */
const generateDistributedSizes = (
  count: number,
  randomize: boolean = false
): CoinSize[] => {
  const sizes: CoinSize[] = [];
  const smallCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const largeCount = count - smallCount - mediumCount;
  sizes.push(...Array(smallCount).fill(CoinSize.Small));
  sizes.push(...Array(mediumCount).fill(CoinSize.Medium));
  sizes.push(...Array(largeCount).fill(CoinSize.Large));
  if (randomize && count > 1) {
    for (let i = sizes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sizes[i], sizes[j]] = [sizes[j], sizes[i]];
    }
  }
  return sizes;
};

/**
 * 主要金幣雨組件
 *
 * @param count 金幣數量
//  * @param resetAtSecond 在第幾秒重頭播放
 * @param showAwardPlayers 是否顯示獲獎玩家，預設為 true
 * @param animationSpeed 金幣動畫速度，預設為標準速度 (當設定時會覆蓋平均分配的速度)
 */
export const CoinRain = ({
  count = 30,
  // resetAtSecond,
  showAwardPlayers = true,
  animationSpeed,
  size,
}: CoinRainProps) => {
  // 建立金幣種子陣列，管理每個金幣的唯一識別符
  const [coinSeeds, setCoinSeeds] = useState<string[]>(() =>
    Array.from({ length: count }, () => generateUniqueId())
  );

  // 建立金幣樣式陣列
  const [coinStyles, setCoinStyles] = useState<React.CSSProperties[]>(() =>
    Array.from({ length: count }, (_, i) => generateCoinStyle(i, count))
  );

  // 使用 useMemo 產生平均分配的速度陣列
  const coinSpeeds = useMemo<CoinAnimationSpeed[]>(
    () => generateDistributedSpeeds(count, true), // 使用隨機排列增加視覺多樣性
    [count]
  );

  // 產生尺寸陣列
  const coinSizes = useMemo<CoinSize[]>(
    () => generateDistributedSizes(count, true),
    [count]
  );

  // 當金幣數量 (count prop) 改變時，重新初始化種子和樣式
  useEffect(() => {
    setCoinSeeds(Array.from({ length: count }, () => generateUniqueId()));
    setCoinStyles(
      Array.from({ length: count }, (_, i) => generateCoinStyle(i, count))
    );
    // 注意：coinSpeeds 已通過 useMemo 自動更新，不需在此處更新
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

      // 更新該金幣的樣式，確保重生後的金幣有新的隨機樣式
      setCoinStyles((prevStyles) => {
        const newStyles = [...prevStyles];
        newStyles[index] = generateCoinStyle(index, count, false); // 為重生的金幣產生新樣式
        return newStyles;
      });

      // 注意：不需要更新速度，因為我們希望每個位置的速度保持一致
    },
    [count]
  ); // count 是 generateCoinStyleWithSpeed 的依賴

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
          initialStyle={coinStyles[index]} // 使用預先產生的樣式
          // resetAtSecond={resetAtSecond}
          onAnimationEnd={() => handleCoinAnimationEnd(index)}
          animationSpeed={animationSpeed || coinSpeeds[index]} // 若提供全域速度設定則使用該設定，否則使用平均分配的速度
          size={size || coinSizes[index]} // 支援全域或分配尺寸
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
