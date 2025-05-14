import { DotLottie } from "@lottiefiles/dotlottie-react";

// 擴充 DotLottie 型別以取得 animationData 中的幀率屬性
export type DotLottieWithData = DotLottie & { animationData: { fr: number } };

// 定義幀變化事件的介面
export interface FrameEvent {
  currentFrame: number;
}

// 定義動畫資訊介面，提高型別安全性
export interface AnimationInfo {
  totalFrames: number;
  frameRate: number;
  duration: number;
  resetAtSecond: number;
  resetAtFrame: number;
  isReady: boolean;
}

// 幣種類型
export enum CoinType {
  Coin = "coin",
  Diamond = "diamond",
}

// 金幣特效屬性介面
export interface CoinRainProps {
  count?: number; // 金幣數量
  resetAtSecond?: number; // 在第幾秒重頭播放
  showAwardPlayers?: boolean; // 是否顯示獲獎玩家
  animationSpeed?: CoinAnimationSpeed; // 金幣動畫速度，可選
}

// 金幣動畫速度的枚舉
export enum CoinAnimationSpeed {
  Fast = "fast",
  Medium = "medium",
  Slow = "slow",
  Default = "default",
}

// 單個金幣屬性介面
export interface CoinProps {
  initialStyle: React.CSSProperties; // 由父層計算好的初始樣式
  resetAtSecond?: number; // 指定在第幾秒重頭播放動畫
  onAnimationEnd?: () => void; // 金幣動畫結束時的回調函式
  animationSpeed?: CoinAnimationSpeed; // 金幣動畫速度，可選
}

// 獲獎玩家介面
export interface AwardPlayer {
  id: number; // 唯一標識
  avatarUrl: string; // 頭像 URL
  amount: number; // 獲獎金額
  style: React.CSSProperties; // 樣式
}
