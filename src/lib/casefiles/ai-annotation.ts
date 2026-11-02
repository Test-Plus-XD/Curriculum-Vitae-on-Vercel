import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Evidence for the AI Annotation Tool, recounted statically from the public repository at commit 50fde4e; no test was run.
const caseFile: CaseFile = {
  role: bi(
    "Made 123 of the repository's 124 commits, building version 1 in Express and rebuilding it in Next.js, with AI coding assistance throughout: Claude Code is credited on two version 2 commits, a Kiro specification guided the interface phase, and the course declaration for version 1 records over 75 % of its code as AI-generated.",
    '程式庫共 124 次提交，其中 123 次由本人完成：先以 Express 建立第一版，再以 Next.js 重建，全程使用 AI 編程輔助。第二版有兩次提交列明 Claude Code 為共同作者，介面階段依循 Kiro 規格，而第一版的課程聲明則列明逾 75 % 程式碼由 AI 生成。',
  ),
  facts: [
    { value: 25, suffix: '/34', label: bi('feature commits straight after a test commit', '次功能提交緊接測試提交') },
    { value: 451, label: bi('test cases written, counted statically', '個已編寫的測試案例（靜態統計）') },
    { value: 41, label: bi('property-based tests written', '個已編寫的屬性測試') },
    { value: 83, label: bi('commits on version 2', '次提交屬於第二版') },
    { value: 3, label: bi('calendar days of version 2 commits', '個曆日內完成第二版提交') },
  ],
  flow: [
    {
      name: bi('Upload form', '上載表單'),
      note: bi(
        'Takes a JPEG, PNG, GIF or WebP by drag and drop, checks the type and the 10 MB limit, and sends it with its labels.',
        '以拖放方式接收 JPEG、PNG、GIF 或 WebP 圖片，檢查格式及 10 MB 上限，再連同標籤一併送出。',
      ),
      link: bi('Multipart request', '多部分表單請求'),
    },
    {
      name: bi('Next.js API route', 'Next.js API 路由'),
      note: bi(
        'Checks the size again and passes the file to the shared Vercel API, which stores it in Firebase Storage.',
        '再次檢查檔案大小，然後把檔案交給共用的 Vercel API，由其存放於 Firebase Storage。',
      ),
      link: bi('Download URL', '下載網址'),
    },
    {
      name: bi('SQLite', 'SQLite'),
      note: bi(
        'A local database file holds images and labels, joined by an annotations table with one confidence score per pair.',
        '本機數據庫檔案保存圖片及標籤，並以標註表連結兩者，每組配對設一個信心分數。',
      ),
      link: bi('Refresh event', '更新事件'),
    },
    {
      name: bi('Gallery', '圖片庫'),
      note: bi(
        'A small event bus tells the gallery to fetch again, debounced at 500 ms and held to one refresh every five seconds, with no page reload.',
        '小型事件匯流排通知圖片庫重新擷取資料，設有 500 毫秒防抖及每五秒最多更新一次的限制，毋須重新載入頁面。',
      ),
      link: bi('Open a card', '打開圖片卡'),
    },
    {
      name: bi('Label review', '標籤審閱'),
      note: bi(
        'Each card shows its labels as percentages. A 0 to 100 % slider sets a score, which the database stores as a decimal.',
        '每張圖片卡以百分比顯示標籤。用戶以 0 至 100 % 的滑桿設定分數，數據庫則以小數保存。',
      ),
      link: bi('Search, filter, export', '搜尋、篩選、匯出'),
    },
    {
      name: bi('Dataset', '數據集'),
      note: bi(
        'Images can be searched by name and filtered by label, then exported or imported as CSV. An import reports how many rows it took, skipped or failed.',
        '圖片可按名稱搜尋、按標籤篩選，並以 CSV 匯出或匯入。匯入完成後會報告已匯入、已略過及出錯的列數。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi('Tests ahead of the code, as far as the commits show', '測試先於程式碼：提交紀錄能證明多少'),
      problem: bi(
        "Version 1's tests were added after its code. The Next.js rebuild set out to show test-driven development across the database, API and interface, and the commit history is the evidence anyone can check.",
        '第一版的測試在程式碼之後才加入。以 Next.js 重建時，目標是在數據庫、API 及介面三層展示測試驅動開發，而提交紀錄正是任何人都能查核的證據。',
      ),
      decision: bi(
        'Work went in as a test commit followed by a feature commit, with refactors after. Interface behaviour was written as 13 numbered correctness properties in a Kiro specification, and fast-check tests were written for 12 of them.',
        '開發時先提交測試，再提交功能，其後才重構。介面行為以 13 項編號的正確性屬性寫入 Kiro 規格，其中 12 項已編寫 fast-check 測試。',
      ),
      result: bi(
        '25 of the 34 feature commits come straight after a test commit, and in 17 of those pairs the test imports a module that first appears in the feature commit. The median gap is under two minutes, which suggests AI-assisted work committed in batches, not a red-green cycle run by hand. The history proves order only: there is no CI or saved passing run, and the one Playwright run saved in the repository failed.',
        '34 次功能提交之中，有 25 次緊接測試提交；其中 17 組的測試所引入的模組，要到功能提交才首次出現。兩者相隔的中位數不足兩分鐘，顯示這可能是 AI 輔助下分批提交的工作，而非人手逐步完成紅綠循環。提交紀錄只能證明先後次序：項目沒有 CI，亦沒有保存任何通過紀錄，而程式庫內唯一保存的 Playwright 執行結果為失敗。',
      ),
    },
    {
      title: bi('Dropping an ORM that did not fit the schema', '棄用與資料表結構不合的 ORM'),
      problem: bi(
        'better-sqlite3-proxy was integrated with its tests first, but it expects standard id primary keys. The schema, carried over from version 1, uses image_id, label_id and annotation_id.',
        'better-sqlite3-proxy 按測試先行的次序整合，但它預期主鍵名為標準的 id。而沿用自第一版的資料表結構，主鍵卻是 image_id、label_id 及 annotation_id。',
      ),
      decision: bi(
        'Later the same day the library was replaced with a 308-line wrapper around better-sqlite3. It keeps the methods that callers already used, such as findWithLabels, findByNameOrCreate and transaction.',
        '同日稍後，改以 308 行的自行編寫封裝層包裝 better-sqlite3，取代該程式庫。封裝層保留呼叫方已在使用的方法，例如 findWithLabels、findByNameOrCreate 及 transaction。',
      ),
      result: bi(
        'The commit left the proxy tests untouched and changed 15 lines across the two data access files, for error handling, validation and formatting. No source file imports the library now.',
        '該次提交沒有改動 proxy 測試，兩個數據存取檔案合共只改動 15 行，內容為錯誤處理、驗證及格式調整。現時已沒有原始碼引入該程式庫。',
      ),
    },
    {
      title: bi("Filtering by label without losing a card's other labels", '按標籤篩選，同時保留圖片卡的其他標籤'),
      problem: bi(
        "The gallery query groups each image's labels with GROUP_CONCAT. A plain WHERE on the label name would remove the other rows before grouping, so a card filtered on one label would show only that label.",
        '圖片庫的查詢以 GROUP_CONCAT 合併每張圖片的標籤。若直接以 WHERE 篩選標籤名稱，其他資料列會在分組前被移除，圖片卡便只會顯示被篩選的那個標籤。',
      ),
      decision: bi(
        'Matching image ids are picked in an IN subquery with its own aliases, and the outer join stays whole. Search and label conditions are collected into one WHERE clause with bound parameters.',
        '改以設有獨立別名的 IN 子查詢選出符合的圖片 ID，外層聯結則保持完整。搜尋及標籤條件會集中到同一個 WHERE 子句，並使用綁定參數。',
      ),
      result: bi(
        'The query still returns every label and confidence score for a matched image, and search and label filters combine in one statement.',
        '查詢仍會傳回符合圖片的所有標籤及信心分數，而搜尋與標籤篩選可在同一條語句中併用。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('A rule committed before its component', '元件未出現前已提交的規則'),
      path: 'AI Annotation Tool v2/app/components/tests/ImageCard.property.test.jsx',
      language: 'jsx',
      url: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/blob/f4e003ae048c2cb76560a0e4c25f4eabb35adea6/AI%20Annotation%20Tool%20v2/app/components/tests/ImageCard.property.test.jsx#L34-L46',
      code: [
        "    test('Property 3: Label display completeness', () => {",
        "        fc.assert(",
        "            fc.property(imageDataGenerator(), (imageData) => {",
        "                // Only test images that have labels",
        "                fc.pre(imageData.labels.length > 0)",
        "                fc.pre(imageData.confidences.length === imageData.labels.length)",
        "",
        "                render(<ImageCard image={imageData} />)",
        "",
        "                // Verify all labels are displayed",
        "                imageData.labels.forEach((label) => {",
        "                    expect(screen.getByText(label)).toBeInTheDocument()",
        "                })",
      ].join('\n'),
      note: bi(
        'From commit f4e003a, where ImageCard.jsx does not exist yet: this file imports it on line 10, and commit a53737c adds it about a minute later. The test states a rule over generated images, not a few fixed examples.',
        '取自提交 f4e003a，當時 ImageCard.jsx 尚未存在：此檔案第 10 行已引入該元件，約一分鐘後才由提交 a53737c 加入。測試針對自動生成的圖片訂明規則，而非只驗證幾個固定例子。',
      ),
    },
    {
      title: bi('The label filter as a subquery', '以子查詢實現標籤篩選'),
      path: 'AI Annotation Tool v2/app/api/images/route.js',
      language: 'javascript',
      url: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/blob/99085e4ef1e5729806108e4f1432f239233eb21b/AI%20Annotation%20Tool%20v2/app/api/images/route.js#L55-L64',
      code: [
        "    // Add label filter",
        "    if (labelFilter.trim()) {",
        "      whereConditions.push(`i.image_id IN (",
        "        SELECT DISTINCT a2.image_id ",
        "        FROM annotations a2 ",
        "        JOIN labels l2 ON a2.label_id = l2.label_id ",
        "        WHERE l2.label_name = ?",
        "      )`);",
        "      queryParams.push(labelFilter.trim());",
        "    }",
      ].join('\n'),
      note: bi(
        'The subquery has its own aliases, a2 and l2, so it narrows the images without touching the joined rows that GROUP_CONCAT reads. The label name is a bound parameter.',
        '子查詢設有獨立別名 a2 及 l2，因此只收窄圖片範圍，不影響 GROUP_CONCAT 讀取的聯結資料列。標籤名稱以綁定參數傳入。',
      ),
    },
  ],
};

export default caseFile;
