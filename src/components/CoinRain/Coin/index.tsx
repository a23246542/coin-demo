// 導入必要的依賴
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";

// 導入型別和常數
import { CoinProps, AnimationInfo, FrameEvent } from "./types";
import { COIN_LOTTIE_SOURCES } from "./constants";
import { calculateDuration, resetAnimation } from "./animation";
import { CoinAnimationSpeed } from "../types";

/**
 * 單個金幣組件
 *
 * @param resetAtSecond 指定在第幾秒重頭播放動畫
 * @param onAnimationEnd 金幣 CSS 動畫完成時的回調函式
 * @param initialStyle 金幣的初始樣式
 * @param animationSpeed 指定金幣 Lottie 動畫的速度版本 (快中慢)
 */
const Coin = ({
  resetAtSecond: propResetAtSecond,
  onAnimationEnd,
  initialStyle,
  animationSpeed = CoinAnimationSpeed.Default, // 預設使用標準速度
}: CoinProps) => {
  // 根據 animationSpeed 選擇 Lottie 來源
  const selectedLottieSrc = useMemo(() => {
    return COIN_LOTTIE_SOURCES[animationSpeed] || COIN_LOTTIE_SOURCES.default;
  }, [animationSpeed]);

  // 使用 state 儲存 DotLottie 實例，確保在 useEffect 中能正確取得
  const [lottieInstance, setLottieInstance] = useState<DotLottie | null>(null);

  // 防止過於頻繁重置的冷卻時間標記
  const resetCooldownRef = useRef<boolean>(false);

  // 新增：組件卸載時銷毀 Lottie 實例
  useEffect(() => {
    // 返回一個清理函式，此函式會在組件卸載前執行
    return () => {
      if (lottieInstance) {
        lottieInstance.destroy();
      }
    };
  }, [lottieInstance]); // 依賴 lottieInstance，確保在 lottieInstance 存在時執行清理

  // 使用 useRef 存儲動畫資訊
  const animInfoRef = useRef<AnimationInfo>({
    totalFrames: 0,
    frameRate: 60, // 預設幀率
    duration: 0,
    resetAtSecond: 0,
    resetAtFrame: 0,
    isReady: false,
  });

  // 使用 ref 追蹤傳入的 resetAtSecond prop 值
  const resetAtSecondPropRef = useRef<number | undefined>(propResetAtSecond);

  // 更新 ref 當 prop 值變化時
  useEffect(() => {
    resetAtSecondPropRef.current = propResetAtSecond;
    // resetAtSecond 或 lottieInstance 變動時，重新計算重置點
    if (animInfoRef.current.isReady && lottieInstance) {
      calculateDuration(lottieInstance, animInfoRef, resetAtSecondPropRef);
    }
  }, [propResetAtSecond, lottieInstance]);

  // 設定回調函數獲取 Lottie 實例
  const dotLottieRefCallback = (instance: DotLottie | null) => {
    if (instance) {
      // 儲存實例至 state
      setLottieInstance(instance);
      // 若已載入幀資訊，立即計算時長
      if (instance.totalFrames > 0) {
        calculateDuration(instance, animInfoRef, resetAtSecondPropRef);
      }
    }
  };

  // 建立重置動畫的回調函式
  const handleResetAnimation = useCallback(() => {
    resetAnimation(lottieInstance, resetCooldownRef);
  }, [lottieInstance]);

  // 監聽動畫載入完成並計算時長
  useEffect(() => {
    const dotLottie = lottieInstance;
    if (!dotLottie) return;

    // 如果還沒準備好且資訊不完整，監聽相關事件
    if (!animInfoRef.current.isReady) {
      // 監聽動畫載入完成事件
      const onLoaded = () => {
        console.log("動畫載入完成");
        calculateDuration(dotLottie, animInfoRef, resetAtSecondPropRef);
      };

      // 幀更新事件 - 也可以用來確認動畫已載入
      const onFrame = (event: FrameEvent) => {
        // 只在第一幀時檢查，避免重複計算
        if (event.currentFrame === 0 && !animInfoRef.current.isReady) {
          if (dotLottie.totalFrames > 0) {
            calculateDuration(dotLottie, animInfoRef, resetAtSecondPropRef);
            // 成功計算後可以移除此監聽器
            if (animInfoRef.current.isReady) {
              dotLottie.removeEventListener("frame", onFrame);
            }
          }
        }
      };

      // 針對不同版本的 API 嘗試不同的事件名稱
      dotLottie.addEventListener("load", onLoaded);
      dotLottie.addEventListener("ready", onLoaded);
      dotLottie.addEventListener("complete", onLoaded);
      dotLottie.addEventListener("frame", onFrame);

      // 保險起見，設定延遲檢查
      const timeoutId = setTimeout(() => {
        if (!animInfoRef.current.isReady && dotLottie.totalFrames > 0) {
          calculateDuration(dotLottie, animInfoRef, resetAtSecondPropRef);
        }
      }, 300);

      return () => {
        dotLottie.removeEventListener("load", onLoaded);
        dotLottie.removeEventListener("ready", onLoaded);
        dotLottie.removeEventListener("complete", onLoaded);
        dotLottie.removeEventListener("frame", onFrame);
        clearTimeout(timeoutId);
      };
    }
  }, [lottieInstance]);

  // 監聽幀變化並在適當時機重置動畫
  useEffect(() => {
    const dotLottie = lottieInstance;
    if (!dotLottie) return;

    let checkInfoInterval: number | null = null;

    // 若尚未準備好，設定檢查間隔
    if (!animInfoRef.current.isReady) {
      checkInfoInterval = window.setInterval(() => {
        if (dotLottie.totalFrames > 0) {
          const result = calculateDuration(
            dotLottie,
            animInfoRef,
            resetAtSecondPropRef
          );
          if (result && checkInfoInterval) {
            clearInterval(checkInfoInterval);
          }
        }
      }, 200);
    }

    // 幀變化事件處理函數 - 根據 Lottie 播放時間判斷重置時機
    const onFrameChange = (event: FrameEvent) => {
      const { resetAtFrame, isReady } = animInfoRef.current;
      if (isReady && event.currentFrame >= resetAtFrame) {
        handleResetAnimation();
      }
    };

    // 添加事件監聽器
    lottieInstance.addEventListener("frame", onFrameChange);

    // 清理函數
    return () => {
      if (lottieInstance) {
        lottieInstance.removeEventListener("frame", onFrameChange);
      }
      if (checkInfoInterval) {
        clearInterval(checkInfoInterval);
      }
    };
  }, [lottieInstance, handleResetAnimation]);

  // 處理 CSS 動畫結束事件
  const handleAnimationEnd = useCallback(() => {
    console.log("Coin animation ended");
    // 呼叫父組件提供的回調函式
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  }, [onAnimationEnd]);

  return (
    <div
      className="coin absolute top-[-100px] coin-animation"
      style={initialStyle}
      onAnimationEnd={handleAnimationEnd}
    >
      <DotLottieReact
        src={selectedLottieSrc}
        autoplay
        style={{ width: "100%", height: "100%" }}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </div>
  );
};

export default Coin;
