import { DotLottie } from "@lottiefiles/dotlottie-react";
// import { CoinAnimationSpeed, CoinSize } from "../types";

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

// // 單個金幣屬性介面
export interface CoinProps {
  initialStyle: React.CSSProperties; // 由父層計算好的初始樣式
  resetAtSecond?: number; // 指定在第幾秒重頭播放動畫
  onAnimationEnd?: () => void; // 金幣動畫結束時的回調函式
  animationSpeed?: CoinAnimationSpeed; // 金幣動畫速度，可選
  size?: CoinSize; // 金幣尺寸，可選 (小/中/大)
}

// 金幣動畫速度的枚舉
export enum CoinAnimationSpeed {
  Fast = "fast",
  Medium = "medium",
  Slow = "slow",
  Default = "default",
}

// 金幣尺寸枚舉
export enum CoinSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

// 單個金幣屬性介面
export interface CoinProps {
  initialStyle: React.CSSProperties; // 由父層計算好的初始樣式
  resetAtSecond?: number; // 指定在第幾秒重頭播放動畫
  onAnimationEnd?: () => void; // 金幣動畫結束時的回調函式
  animationSpeed?: CoinAnimationSpeed; // 金幣動畫速度，可選
  size?: CoinSize; // 新增尺寸屬性
}
