/// <reference types="vite/client" />

// 宣告 .lottie 檔案模組
declare module "*.lottie" {
  const content: string;
  export default content;
}
