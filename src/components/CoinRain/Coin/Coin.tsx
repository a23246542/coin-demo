// 導入必要的依賴
import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";

// 導入型別和常數
import {
  CoinProps,
  AnimationInfo,
  FrameEvent,
  CoinSize,
  CoinAnimationSpeed,
} from "./types";
import { COIN_LOTTIE_SOURCES } from "./constants";
import { calculateDuration, resetAnimation } from "./animation";

// 金幣尺寸對應表
const COIN_SIZE_MAP = {
  [CoinSize.Small]: { width: "120px", height: "120px" },
  [CoinSize.Medium]: { width: "140px", height: "140px" },
  [CoinSize.Large]: { width: "160px", height: "160px" },
};

// 動畫速度對應的 resetAtSecond 秒數對應表
const ANIMATION_SPEED_TO_RESET_SECOND: Record<CoinAnimationSpeed, number> = {
  [CoinAnimationSpeed.Fast]: 0.94, // 快速動畫
  [CoinAnimationSpeed.Medium]: 1.4, // 中速動畫
  [CoinAnimationSpeed.Slow]: 1.9, // 慢速動畫
  [CoinAnimationSpeed.Default]: 1.2, // 預設
};

/**
 * 單個金幣組件
 *
 * @param onAnimationEnd 金幣 CSS 動畫完成時的回調函式
 * @param initialStyle 金幣的初始樣式
 * @param animationSpeed 指定金幣 Lottie 動畫的速度版本 (快中慢)
 * @param size 指定金幣尺寸 (小中大)
 */
const Coin = React.memo(
  ({
    onAnimationEnd,
    initialStyle,
    animationSpeed = CoinAnimationSpeed.Default, // 預設使用標準速度
    size = CoinSize.Medium, // 預設中型
  }: CoinProps) => {
    // 根據 animationSpeed 選擇 Lottie 來源
    const selectedLottieSrc = useMemo(() => {
      return COIN_LOTTIE_SOURCES[animationSpeed] || COIN_LOTTIE_SOURCES.default;
    }, [animationSpeed]);

    // 根據 animationSpeed 決定 resetAtSecond
    const resetAtSecond = useMemo(() => {
      return ANIMATION_SPEED_TO_RESET_SECOND[animationSpeed] ?? 1.2;
    }, [animationSpeed]);

    // 使用 state 儲存 DotLottie 實例，確保在 useEffect 中能正確取得
    const [lottieInstance, setLottieInstance] = useState<DotLottie | null>(
      null
    );

    // 防止過於頻繁重置的冷卻時間標記
    const resetCooldownRef = useRef<boolean>(false);

    // 新增：組件卸載時銷毀 Lottie 實例
    useEffect(() => {
      // 返回一個清理函式，此函式會在組件卸載前執行
      return () => {
        if (lottieInstance) {
          // lottieInstance.destroy();
          // 先停止所有動畫活動
          lottieInstance.pause();
          // 移除所有事件監聽器
          // lottieInstance.removeEventListener(); // 確保無監聽器殘留
          // 銷毀實例
          lottieInstance.destroy();
          // 清除可能的任何引用
          setLottieInstance(null);
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

    // 使用 ref 追蹤 resetAtSecond
    const resetAtSecondRef = useRef<number>(resetAtSecond);
    useEffect(() => {
      resetAtSecondRef.current = resetAtSecond;
      if (animInfoRef.current.isReady && lottieInstance) {
        calculateDuration(lottieInstance, animInfoRef, resetAtSecondRef);
      }
    }, [resetAtSecond, lottieInstance]);

    // 設定回調函數獲取 Lottie 實例
    const dotLottieRefCallback = (instance: DotLottie | null) => {
      if (instance) {
        // 儲存實例至 state
        setLottieInstance(instance);
        // 若已載入幀資訊，立即計算時長
        if (instance.totalFrames > 0) {
          calculateDuration(instance, animInfoRef, resetAtSecondRef);
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
          console.log("動畫載入完成", dotLottie.isLoaded);
          calculateDuration(dotLottie, animInfoRef, resetAtSecondRef);
          dotLottie.play();
        };

        // 幀更新事件 - 也可以用來確認動畫已載入
        const onFrame = (event: FrameEvent) => {
          // 只在第一幀時檢查，避免重複計算
          if (event.currentFrame === 0 && !animInfoRef.current.isReady) {
            if (dotLottie.totalFrames > 0) {
              calculateDuration(dotLottie, animInfoRef, resetAtSecondRef);
              // 成功計算後可以移除此監聽器
              if (animInfoRef.current.isReady) {
                dotLottie.removeEventListener("frame", onFrame);
              }
            }
          }
        };

        // 針對不同版本的 API 嘗試不同的事件名稱
        dotLottie.addEventListener("load", onLoaded);
        //   dotLottie.addEventListener("ready", onLoaded);
        //   dotLottie.addEventListener("complete", onLoaded);
        dotLottie.addEventListener("frame", onFrame);

        // 保險起見，設定延遲檢查
        const timeoutId = setTimeout(() => {
          if (!animInfoRef.current.isReady && dotLottie.totalFrames > 0) {
            calculateDuration(dotLottie, animInfoRef, resetAtSecondRef);
          }
        }, 300);

        return () => {
          dotLottie.removeEventListener("load", onLoaded);
          // dotLottie.removeEventListener("ready", onLoaded);
          // dotLottie.removeEventListener("complete", onLoaded);
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
              resetAtSecondRef
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

    // 新增狀態追蹤 Lottie 播放
    const [playLottie, setPlayLottie] = useState(false);

    // 處理 CSS 動畫開始事件，確保 Lottie 與 CSS 動畫同步
    const handleCssAnimationStart = useCallback(() => {
      setPlayLottie(true);
    }, []);

    // 使用 useLayoutEffect 控制 Lottie 動畫播放狀態
    // 確保在畫面繪製前就設定好動畫狀態，避免閃爍
    useEffect(() => {
      if (!lottieInstance) return;
      // console.log({ playLottie, lottieInstance });

      if (playLottie) {
        //   console.log({
        //     playLottie,
        //     isReady: lottieInstance.isLoaded,
        //     hasplay: lottieInstance.play,
        //   });
        lottieInstance.play();

        //   lottieInstance.isReady()
      } else {
        //   console.log({
        //     playLottie,
        //     isReady: lottieInstance.isLoaded,
        //     hasplay: lottieInstance.play,
        //   });
        //   lottieInstance.goToAndStop(0, true);
        lottieInstance.pause();
        lottieInstance.setFrame(0);
      }
    }, [lottieInstance, playLottie]);

    // 處理 CSS 動畫結束事件
    const handleAnimationEnd = useCallback(() => {
      console.log("Coin animation ended");
      // 呼叫父組件提供的回調函式
      if (onAnimationEnd) {
        onAnimationEnd();
      }
      // 動畫結束時停止 Lottie 播放
      setPlayLottie(false);
    }, [onAnimationEnd]);

    // 依據 size 取得尺寸 style
    const sizeStyle = useMemo(
      () => COIN_SIZE_MAP[size as CoinSize] || COIN_SIZE_MAP[CoinSize.Medium],
      [size]
    );

    return (
      <div
        className="coin absolute top-[-160px] coin-animation"
        style={{ ...initialStyle, ...sizeStyle }}
        onAnimationEnd={handleAnimationEnd}
        onAnimationStart={handleCssAnimationStart} // 監聽 CSS 動畫開始
      >
        <DotLottieReact
          src={selectedLottieSrc}
          loop={true} // 循環播放
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
          dotLottieRefCallback={dotLottieRefCallback}
        />
      </div>
    );
  }
);

export default Coin;
