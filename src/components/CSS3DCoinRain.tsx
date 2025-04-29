import { useMemo } from "react";
import "../styles/tailwind-components.css";

/**
 * 金幣雨元件的屬性介面
 */
interface CSS3DCoinRainProps {
  count?: number; // 金幣數量
}

/**
 * 單個 3D 金幣元件
 */
const CSS3DCoin = () => {
  // 為每個金幣生成隨機特性，使落下效果更自然
  const style = useMemo(() => {
    const randomLeft = Math.random() * 100; // 隨機水平位置 (0-100%)
    const randomDelay = Math.random() * 3; // 隨機延遲開始 (0-3秒)
    const randomDuration = Math.random() * 4; // 隨機落下時間 (6-10秒)

    return {
      left: `${randomLeft}%`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
    };
  }, []);

  // 生成隨機初始旋轉角度
  const initialRotation = useMemo(() => {
    const randomRotationY = Math.random() * 360; // 隨機 Y 軸旋轉 (0-360度)
    return { transform: `rotateY(${randomRotationY}deg)` };
  }, []);

  // 建立 36 個邊緣片段，模擬圓柱形側面
  const renderEdges = () => {
    const edges = [];
    for (let i = 0; i < 36; i++) {
      edges.push(
        <div key={i} className={`css3d-coin-edge css3d-coin-edge-${i}`} />
      );
    }
    return edges;
  };

  return (
    <div
      className="absolute w-[60px] h-[60px] transform-gpu animate-[css3d-fall_linear_forwards] will-change-transform will-change-opacity"
      style={style}
    >
      <div style={initialRotation} className="preserve-3d">
        {/* 金幣正面 */}
        <div className="absolute w-full h-full backface-hidden rounded-full flex items-center justify-center font-bold text-[#ffe066] text-3xl css3d-coin-front">
          <span
            className="text-3xl leading-none css3d-coin-symbol"
            role="img"
            aria-label="star"
          >
            ⭐
          </span>
        </div>

        {/* 金幣背面 */}
        <div className="absolute w-full h-full backface-hidden rounded-full flex items-center justify-center font-bold text-[#ffe066] text-3xl css3d-coin-back">
          <span
            className="text-3xl leading-none css3d-coin-symbol"
            role="img"
            aria-label="star"
          >
            ⭐
          </span>
        </div>

        {/* 金幣側面容器 - 確保完美圓形 */}
        <div className="absolute w-full h-full rounded-full css3d-coin-edge-container">
          {/* 金幣側面 - 多個 div 模擬圓形邊緣 */}
          {renderEdges()}
        </div>
      </div>
    </div>
  );
};

/**
 * CSS 3D 金幣雨元件
 * 使用純 CSS 3D 變換實現金幣旋轉並落下的效果
 *
 * @param count 金幣數量，預設為 30
 */
const CSS3DCoinRain = ({ count = 30 }: CSS3DCoinRainProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10 perspective-[1000px]">
      {Array.from({ length: count }).map((_, index) => (
        <CSS3DCoin key={index} />
      ))}
    </div>
  );
};

export default CSS3DCoinRain;
