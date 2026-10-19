// npm run dev：先建置一次並持續監看原始碼，同時啟動 http://127.0.0.1:5175。
// 改程式存檔後會自動重建，重新整理 BC 或預覽頁即可載入最新版。
import { watchBuild } from './build.mjs';
import { startPreview } from './serve.mjs';

const ctx = await watchBuild();
try {
  await startPreview();
} catch (error) {
  console.error(error.message);
  await ctx.dispose();
  process.exitCode = 1;
}
