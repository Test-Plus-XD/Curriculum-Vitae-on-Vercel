import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Evidence for Vapor, measured from Web-Assignment at afcf268, its project report and the group's peer evaluation form.
const caseFile: CaseFile = {
  role: bi(
    "Group coursework, not solo: four students at the first stage and two on the final report. The group's peer evaluation form records me setting up the database, building the back-end features and rewriting teammates' static pages as database-driven PHP; for the later Firebase, Stripe and Gemini work every commit came from my account, so git cannot separate our shares, and the report declares generative AI involvement at level 2, \"Full AI\" (AI used to complete most of the areas of the project), crediting assistance from ChatGPT and Gemini.",
    '這是小組課業，並非獨立完成：初期有四名同學，最終報告署名兩人。小組互評表記錄本人建立數據庫、開發後台功能，並把組員的靜態頁面改寫成由數據庫驅動的 PHP；其後 Firebase、Stripe 及 Gemini 部分的提交全部出自本人帳戶，git 無法分清兩人各自的份額，而報告聲明生成式 AI 的參與程度為第 2 級「Full AI」（以 AI 完成項目大部分範疇），並註明獲 ChatGPT 及 Gemini 協助。',
  ),
  facts: [
    { value: 9233, label: bi('lines of PHP, JavaScript, CSS and SQL, vendor code excluded', '行 PHP、JavaScript、CSS 及 SQL（不含第三方程式庫）') },
    { value: 2, label: bi('students on the final report', '名同學署名最終報告') },
    { value: 21, label: bi('REST route branches', '條 REST 路由分支') },
    { value: 3, label: bi('Firestore collections', '個 Firestore 集合') },
    { value: 57, label: bi('commits, 38 of them batch uploads', '次提交，其中 38 次為批量上載') },
  ],
  flow: [
    {
      name: bi('Sign-in', '登入'),
      note: bi(
        'Firebase Authentication signs the visitor in, and PHP then keeps its own session.',
        'Firebase Authentication 負責登入，其後由 PHP 保存自己的工作階段。',
      ),
      link: bi('session opened', '工作階段建立'),
    },
    {
      name: bi('Catalogue', '商品目錄'),
      note: bi(
        'PHP pages call internal REST classes that read Cloud Firestore; search and filters run in the browser.',
        'PHP 頁面呼叫內部 REST 類別讀取 Cloud Firestore；搜尋及篩選在瀏覽器內進行。',
      ),
      link: bi('add to cart', '加入購物車'),
    },
    {
      name: bi('Cart', '購物車'),
      note: bi(
        'Free games go straight to the library; paid games wait in a localStorage cart, one of each.',
        '免費遊戲直接加入遊戲庫；付費遊戲存放在 localStorage 購物車，每款一份。',
      ),
      link: bi('line items in HKD', '港幣結帳項目'),
    },
    {
      name: bi('Stripe Checkout', 'Stripe Checkout'),
      note: bi(
        "An Express service creates the Checkout session and the buyer pays on Stripe's hosted page.",
        '由 Express 服務建立 Checkout 工作階段，買家在 Stripe 託管的頁面付款。',
      ),
      link: bi('return with session ID', '帶工作階段 ID 返回'),
    },
    {
      name: bi('Payment check', '付款核實'),
      note: bi(
        'The confirmation page asks the service to fetch the session from Stripe and goes on only if it is paid.',
        '確認頁面請服務向 Stripe 取回該工作階段，確認已付款才繼續。',
      ),
      link: bi('purchase records', '購買紀錄'),
    },
    {
      name: bi('Library', '遊戲庫'),
      note: bi(
        'Owned games are listed with their purchase date, and their product pages read "Owned".',
        '已購遊戲連同購買日期列出，其商品頁面亦會顯示「Owned」。',
      ),
      link: bi('same records', '同一批紀錄'),
    },
    {
      name: bi('Admin dashboard', '管理後台'),
      note: bi(
        'Admins manage users, products and purchases and see revenue by Hong Kong day or month in Chart.js.',
        '管理員可管理用戶、商品及購買紀錄，並以 Chart.js 按香港時間的日或月查看收入。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi('One PHP template instead of a page per game', '以一個 PHP 範本取代一款遊戲一個頁面'),
      problem: bi(
        'The first version was split between four students, and each game had its own HTML page with hard-coded content. Changing a game meant editing markup.',
        '第一版由四名同學分工，每款遊戲各有一個內容寫死的 HTML 頁面，要修改遊戲資料就得改動標記。',
      ),
      decision: bi(
        "I set up the MySQL database and rewrote the group's pages in PHP. A single product.php takes a product ID, and product_cards.php loops over database rows.",
        '本人建立 MySQL 數據庫，並把組員的頁面改寫成 PHP。單一 product.php 按商品 ID 顯示內容，product_cards.php 則逐行讀取數據庫資料。',
      ),
      result: bi(
        "By the repository's first upload on 25 February 2025, one template rendered every game from the database. The personal credit rests on the group's peer evaluation form, because that upload is a single batch and git cannot show who wrote what.",
        '到 2025 年 2 月 25 日首次上載至儲存庫時，所有遊戲已由同一範本從數據庫讀取顯示。個人分工的依據是小組互評表，因為該次上載只是一個批次，git 看不出誰寫了甚麼。',
      ),
    },
    {
      title: bi('Replacing MySQL with Firestore behind PHP', '在 PHP 背後以 Firestore 取代 MySQL'),
      problem: bi(
        "The store began on PDO and SQL. Firestore's REST API wraps every value in a typed envelope and has no joins, while the PHP pages and admin tables expected flat rows.",
        '商店最初使用 PDO 及 SQL。Firestore 的 REST API 會以帶類型的封套包裹每個值，亦不支援聯結，但 PHP 頁面及管理表格需要的是扁平資料列。',
      ),
      decision: bi(
        'One PHP trait, FirestoreApiTrait, converts values to and from those envelopes, and each collection became a small class with its own routes. Joins moved into PHP lookup maps, and a small adapter kept the admin paging, with array_slice standing in for LIMIT.',
        '以一個 PHP trait（FirestoreApiTrait）負責封套與 PHP 值之間的轉換，每個集合各成一個設有路由的小類別。聯結改由 PHP 查找表處理，並以小型轉接器保留管理頁的分頁，用 array_slice 代替 LIMIT。',
      ),
      result: bi(
        'Three collections and 21 route branches share one 443-line helper file, and the PDO versions are kept under Archive/. The MySQL stock trigger had no Firestore equivalent, so purchases no longer reduce stock.',
        '三個集合及 21 條路由分支共用一個 443 行的輔助檔案，PDO 版本則保留在 Archive/。MySQL 的庫存觸發器在 Firestore 上沒有對應做法，因此購買後不再扣減庫存。',
      ),
    },
    {
      title: bi('From an imitation card form to Stripe Checkout', '由模擬信用卡表格轉用 Stripe Checkout'),
      problem: bi(
        'The early checkout was a local form with card number and CVV fields and no real payment behind it. A redirect back to the store would prove nothing about payment.',
        '早期的結帳只是本地表格，設有卡號及 CVV 欄位，背後並無真實付款。單靠轉址回到商店，亦無法證明買家已付款。',
      ),
      decision: bi(
        "Checkout moved to Stripe's hosted page through a small Express service. A /verify-Stripe route fetches the session from Stripe, and the browser's confirmation page records purchases only if that route reports it as paid.",
        '結帳改經小型 Express 服務轉到 Stripe 託管頁面。/verify-Stripe 路由向 Stripe 取回工作階段，瀏覽器的確認頁面要待該路由回報已付款，才記錄購買。',
      ),
      result: bi(
        "Card details are entered on Stripe's page, not the store's. The service ran on a local server with a Stripe test card noted in its source, and the team's manual acceptance sheet marks Stripe payment as passed.",
        '卡號資料在 Stripe 的頁面輸入，不經商店頁面。服務在本地伺服器運行，原始碼註明使用 Stripe 測試卡；團隊的人手驗收表把 Stripe 付款一項標示為通過。',
      ),
    },
  ],
  exhibits: [
    {
      src: '/images/projects/steam-platform/site-map.webp',
      width: 1600,
      height: 1326,
      alt: bi(
        'Site map in three bands. Under the home page sit Search, Login, Cart and the Admin Panel; the front end adds the product and payment result pages; the back end holds the profit diagram, purchase, product and user records, and an insert and update page.',
        '分為三層的網站地圖。主頁之下是搜尋、登入、購物車及管理面板；前台另有商品及付款結果頁面；後台則有盈利圖表、購買紀錄、商品紀錄、用戶紀錄，以及新增及更新頁面。',
      ),
      caption: bi(
        "The team's site map from the project report: main navigation, front end and back end.",
        '專題報告內由團隊繪製的網站地圖：主導覽、前台及後台。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('A stock rule inside the database', '寫在數據庫內的庫存規則'),
      path: 'sql/mydb.sql',
      language: 'sql',
      url: 'https://github.com/Test-Plus-XD/Web-Assignment/blob/afcf26862fda74410dea108897cfbb32ea3bcce1/sql/mydb.sql#L86-L98',
      code: [
        "CREATE TRIGGER `reduce_stock` AFTER INSERT ON `tb_owned_products` FOR EACH ROW BEGIN",
        "    -- Prevent stock from reducing below 0 and ignore digital products",
        "    IF (SELECT stock FROM tb_products WHERE product_id = NEW.product_id) IS NOT NULL ",
        "       AND (SELECT stock FROM tb_products WHERE product_id = NEW.product_id) > 0",
        "       AND (SELECT isDigital FROM tb_products WHERE product_id = NEW.product_id) = 0 THEN",
        "        UPDATE tb_products ",
        "        SET stock = stock - 1 ",
        "        WHERE product_id = NEW.product_id;",
        "    ELSEIF (SELECT stock FROM tb_products WHERE product_id = NEW.product_id) <= 0 THEN",
        "        SIGNAL SQLSTATE '45000' ",
        "        SET MESSAGE_TEXT = 'Stock cannot go below zero';",
        "    END IF;",
        "END",
      ].join('\n'),
      note: bi(
        'From the MySQL phase: it reduces stock for physical goods only and rejects the insert once stock is at zero, whichever code wrote the row. The final Firestore store does not use it.',
        '屬於 MySQL 階段：只扣減實體商品的庫存，庫存為零時則拒絕寫入，不論由哪段程式碼寫入都一樣。最終的 Firestore 版本並無使用。',
      ),
    },
    {
      title: bi('Asking Stripe whether a session was paid', '向 Stripe 查核工作階段是否已付款'),
      path: 'src/js/stripe.js',
      language: 'javascript',
      url: 'https://github.com/Test-Plus-XD/Web-Assignment/blob/afcf26862fda74410dea108897cfbb32ea3bcce1/src/js/stripe.js#L64-L74',
      code: [
        "    try {\r",
        "        const session = await stripe.checkout.sessions.retrieve(sessionId);\r",
        "        if (session.payment_status === \"paid\") {\r",
        "            res.json({ verified: true, session });\r",
        "        } else {\r",
        "            res.status(403).json({ verified: false, message: \"Payment not completed\" });\r",
        "        }\r",
        "    } catch (error) {\r",
        "        console.error(\"Error verifying session:\", error);\r",
        "        res.status(500).json({ error: \"Failed to verify session\" });\r",
        "    }\r",
      ].join('\n'),
      note: bi(
        'The check the confirmation page relies on: the session is fetched from Stripe rather than taken on trust from the return URL, and any status other than paid gets a 403.',
        '確認頁面倚賴的查核：工作階段由 Stripe 取回，而非單憑返回網址判斷；狀態不是已付款便回應 403。',
      ),
    },
  ],
};

export default caseFile;
