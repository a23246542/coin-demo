// 使用 import 明確引入靜態資源
import coinFast from './lottie/90fps2s.lottie';
import coinMedium from './lottie/60fps3s.lottie';  
import coinSlow from './lottie/45fps4s.lottie';

// 金幣 Lottie 動畫來源 - 不同速度版本
export const COIN_LOTTIE_SOURCES = {
  // 預設動畫源 (60fps 3s)
  default: coinMedium,
  // 快速版本 (FPS 較高)
  fast: coinFast,
  // 中速版本 (適中 FPS)
  medium: coinMedium,
  // 慢速版本 (FPS 較低)
  slow: coinSlow
};

// 為了向下相容，保留原始常數
export const COIN_LOTTIE_SRC = COIN_LOTTIE_SOURCES.default;

// 個別常數，便於直接引用
export const COIN_LOTTIE_SRC_FAST = COIN_LOTTIE_SOURCES.fast;
export const COIN_LOTTIE_SRC_MEDIUM = COIN_LOTTIE_SOURCES.medium;
export const COIN_LOTTIE_SRC_SLOW = COIN_LOTTIE_SOURCES.slow;

// 備註：其他備用動畫資源
// "https://lottie.host/11822c63-d1ab-4429-bec7-a5202c212ba4/4VXbEcwOdb.lottie"; //35fps 3s
// "https://lottie.host/e2b455a7-5733-418b-8b00-e1cf9684394a/ycvPKfDZJS.lottie";
// "https://lottie.host/931236a4-1a45-4f56-9d26-27bc31fa2683/w1iJh9Vv51.json";
