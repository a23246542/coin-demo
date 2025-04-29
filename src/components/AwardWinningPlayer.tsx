import React from "react";

interface AwardWinningPlayerProps {
  avatarUrl: string;
  amount: number | string;
  className?: string; // 方便外部覆寫
}

/**
 * 獲獎會員展示組件
 * - 支援自訂頭像、金額與標籤
 * - 遵循 SOLID 原則，易於擴展
 */
const AwardWinningPlayer: React.FC<AwardWinningPlayerProps> = ({
  avatarUrl,
  amount,
  className = "",
}) => (
  <div
    // className={`AwardWinningPlayer inline-flex min-w-[100px] h-32 px-6 items-center gap-4 rounded bg-gradient-to-br from-[#FAE24B] to-[#FFB10A] shadow-[inset_0_-2px_0_0_rgba(217,119,0,0.80),inset_0_2px_0_0_rgba(255,234,116,0.75)] ${className}`}
    className={`AwardWinningPlayer inline-flex w-120 h-32 px-6 items-center gap-4 rounded bg-gradient-to-br from-[#FAE24B] to-[#FFB10A] shadow-[inset_0_-2px_0_0_rgba(217,119,0,0.80),inset_0_2px_0_0_rgba(255,234,116,0.75)] ${className}`}
    // ...可擴充 data- 屬性
  >
    <div
      className="w-24 h-24 rounded-[75px] flex-shrink-0"
      style={{
        background: `url(${avatarUrl}) lightgray -4.285px -1.714px / 121.429% 126.456% no-repeat`,
      }}
      aria-label="會員頭像"
    />
    <span className="text-[#8A1700] font-roboto text-xl font-bold ml-4">
      +{amount}
    </span>
  </div>
);

export default AwardWinningPlayer;
