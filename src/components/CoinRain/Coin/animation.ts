import { DotLottie } from "@lottiefiles/dotlottie-react";
import { AnimationInfo, DotLottieWithData, FrameEvent } from "./types";

/**
 * 計算動畫時長和重置點的函式
 *
 * @param dotLottie DotLottie 實例
 * @param animInfoRef 動畫資訊參考
 * @param resetAtSecondPropRef 重置秒數屬性參考
 * @returns 是否成功計算
 */
export const calculateDuration = (
  dotLottie: DotLottie,
  animInfoRef: React.MutableRefObject<AnimationInfo>,
  resetAtSecondPropRef: React.MutableRefObject<number | undefined>
): boolean => {
  try {
    // 確保幀數有效
    if (!dotLottie.totalFrames || dotLottie.totalFrames <= 0) {
      console.warn("無效的幀數資訊，等待正確載入...");
      return false;
    }

    // 取得動畫總幀數和幀率
    const totalFrames = dotLottie.totalFrames;
    // 安全地從擴充後的實例取得幀率
    const dotLottieWD = dotLottie as DotLottieWithData;
    const frameRate =
      dotLottieWD.animationData?.fr ?? animInfoRef.current.frameRate;

    // 計算動畫時長 (秒)
    const duration = dotLottie.duration;

    // 計算指定秒數對應的幀數
    // 如果有設定 resetAtSecond，則使用它，否則使用動畫時長的一半
    const resetAtSecond =
      resetAtSecondPropRef.current !== undefined
        ? resetAtSecondPropRef.current
        : duration / 2;
    const resetAtFrame = Math.floor(resetAtSecond * frameRate);

    // 存儲資訊
    animInfoRef.current = {
      ...animInfoRef.current,
      totalFrames,
      frameRate,
      duration,
      resetAtFrame,
      isReady: true,
    };

    return true;
  } catch (error) {
    console.error("計算動畫時長時發生錯誤:", error);
    return false;
  }
};

/**
 * 重置動畫到起始位置的函式
 *
 * @param lottieInstance Lottie 實例
 * @param resetCooldownRef 重置冷卻標記參考
 */
export const resetAnimation = (
  lottieInstance: DotLottie | null,
  resetCooldownRef: React.MutableRefObject<boolean>
) => {
  // 避免過於頻繁重置，使用冷卻機制
  if (resetCooldownRef.current || !lottieInstance) {
    return;
  }

  // 設置冷卻標記
  resetCooldownRef.current = true;

  // 重置動畫
  lottieInstance.setFrame(0);
  lottieInstance.play();

  // 100ms 後解除冷卻
  setTimeout(() => {
    resetCooldownRef.current = false;
  }, 100);
};
