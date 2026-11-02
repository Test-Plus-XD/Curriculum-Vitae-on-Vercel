import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Case file for Pour Rice, rechecked against the public repositories Android-Assignment (01c57f6), Cross-Platform-Assignment (22d8bba)
// and iOS-Assignment (126ec03). The private back-end repositories contribute prose and counts only: no paths, code or hashes.
// Nothing here claims passing tests or continuous integration, and the Stripe advertising check is described for iOS alone.
const caseFile: CaseFile = {
  role: bi(
    'Sole human developer across the web, Android and iOS apps and their shared back end, working with Claude and Codex coding agents. All 104 merged pull requests in the five repositories were opened and merged from one human account, and 103 of them came from branches named for Claude or Codex. The history cannot tell hand-written code from agent-written code, so no share is claimed.',
    '網頁、Android 及 iOS 應用程式及其共用後端的唯一人類開發者，與 Claude 及 Codex 編碼代理合作。五個儲存庫中全部 104 個已合併的拉取請求，均由同一個人類帳戶開啟並合併，其中 103 個來自以 Claude 或 Codex 命名的分支。版本記錄無法分辨手寫與代理撰寫的程式碼，因此不聲稱任何比例。',
  ),
  facts: [
    { value: 572, label: bi('commits across five repositories', '個提交（涵蓋五個儲存庫）') },
    { value: 3, label: bi('client apps on one shared back end', '個客戶端應用程式共用同一後端') },
    { value: 89, label: bi('REST route handlers', '個 REST 路由處理器') },
    { value: 16, label: bi('real-time event types', '種即時事件類型') },
    { value: 104, label: bi('merged pull requests', '個已合併的拉取請求') },
  ],
  flow: [
    {
      name: bi('Sign in', '登入'),
      note: bi(
        'All three apps sign in through Firebase Authentication, and the API verifies the Firebase ID token on its protected routes.',
        '三個應用程式均透過 Firebase 驗證登入，API 在受保護的路由上核實 Firebase ID 權杖。',
      ),
      link: bi('The ID token goes with each request', '每次請求都附上 ID 權杖'),
    },
    {
      name: bi('Find a restaurant', '搜尋餐廳'),
      note: bi(
        'Search goes through the API to Algolia, with district and keyword filters that match both the English and Traditional Chinese fields. The Ionic web app and the Flutter app use Google Maps; the iOS app uses MapKit.',
        '搜尋經 API 轉到 Algolia，地區及關鍵字篩選同時比對英文與繁體中文欄位。Ionic 網頁應用程式及 Flutter 應用程式使用 Google Maps，iOS 應用程式則使用 MapKit。',
      ),
      link: bi('A diner picks a restaurant and asks for a table', '食客揀選餐廳並預約座位'),
    },
    {
      name: bi('Book a table', '預約座位'),
      note: bi(
        'The API keeps a booking in a small state machine. A diner may edit or cancel only while it is pending; an owner may accept or decline only a pending booking, and complete only an accepted one.',
        'API 以簡單的狀態機管理預約。食客只可在預約待處理時修改或取消；東主只可接受或拒絕待處理的預約，亦只可完成已接受的預約。',
      ),
      link: bi('The diner can also message the restaurant', '食客亦可向餐廳發送訊息'),
    },
    {
      name: bi('Chat', '聊天'),
      note: bi(
        'Each client registers on the Railway Socket.IO server with a Firebase token, which the server has the API check. The server broadcasts a message at once and saves it through the API under the same identifier. The Flutter and iOS apps fall back to REST when the socket is down.',
        '各客戶端以 Firebase 權杖向 Railway 的 Socket.IO 伺服器登記，伺服器再交由 API 核實。伺服器即時廣播訊息，並以同一識別碼透過 API 儲存。Socket 失效時，Flutter 及 iOS 應用程式會改用 REST。',
      ),
      link: bi('The API saves the message and sends a push', 'API 儲存訊息並發出推送'),
    },
    {
      name: bi('Notify', '通知'),
      note: bi(
        'Booking changes and new chat messages go out through Firebase Cloud Messaging. Tokens are stored with their platform, tokens registered as native Android receive data-only messages and the rest the standard payload, and a token is deleted only after a terminal delivery error. Each message carries a route, so a tap can open the right screen.',
        '預約狀態變更及新聊天訊息均透過 Firebase Cloud Messaging 發出。權杖連同平台一併儲存，登記為原生 Android 的權杖接收純資料訊息，其餘則收標準內容；權杖只會在出現終止性投遞錯誤後才被刪除。每則訊息附有路由，點按後可開啟對應畫面。',
      ),
      link: bi('Menu questions go to the assistant', '餐牌問題交給助理'),
    },
    {
      name: bi('Ask the assistant', '詢問助理'),
      note: bi(
        'For a restaurant question the API reads the restaurant and up to 40 of its menu items itself, then prompts Gemini. The same routes draft bilingual advert copy, and a DocuPipe route turns an uploaded menu into structured items, waiting on two background jobs for at most 20 checks each.',
        '遇上餐廳相關問題，API 會自行讀取餐廳及最多 40 個餐牌項目，再向 Gemini 發出提示。同一組路由亦可撰寫雙語廣告文案；另一條 DocuPipe 路由把上載的餐牌轉成結構化項目，並等候兩項背景工作，每項最多檢查 20 次。',
      ),
      link: bi('An owner promotes the restaurant', '東主推廣餐廳'),
    },
    {
      name: bi('Advertise', '刊登廣告'),
      note: bi(
        'An owner pays a fixed HK$10 through Stripe-hosted checkout, set up by the API. The iOS app then asks the API whether that session is a paid advertisement payment for the right restaurant before it opens the advert form. That check is evidenced on iOS only.',
        '東主經 API 建立的 Stripe 託管結帳頁面支付固定的港幣 10 元。iOS 應用程式隨後向 API 查詢該工作階段是否為正確餐廳的廣告付款，確認後才開啟廣告表單。此項檢查只有 iOS 有證據支持。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi('Saving a chat message under the identifier it was broadcast with', '以廣播時的識別碼儲存聊天訊息'),
      problem: bi(
        'Chat messages were saved through the API first and broadcast only afterwards, so every recipient waited on a serverless round trip. Broadcasting earlier meant the live feed and the stored history had to stay in step, and a repeated write must not create a second message or inflate the room’s message count.',
        '聊天訊息原本先經 API 儲存，之後才廣播，每位收件人都要等一次無伺服器往返。把廣播提前之後，即時內容與儲存紀錄必須保持一致，而且重複寫入不可產生第二則訊息，也不可令聊天室的訊息計數虛增。',
      ),
      decision: bi(
        'The socket server now makes the message identifier, broadcasts the message to the room, and then saves it through the API under that same identifier. The API uses the identifier as the document key; if the document already exists it answers 200 instead of 201 and leaves the room’s counter alone.',
        'Socket 伺服器現在先自行產生訊息識別碼，向聊天室廣播，再以同一識別碼透過 API 儲存。API 以該識別碼作為文件鍵；若文件已存在，便回應 200 而非 201，並且不改動聊天室計數。',
      ),
      result: bi(
        'Recipients see a message as soon as the server has it, and the live copy and the stored copy share one identifier. The cost shows in the order of events: if saving fails, the sender is told through the delivery confirmation, but recipients have already seen the message. Both changes landed on 15 April 2026.',
        '收件人在伺服器收到訊息時即可看見，即時版本與儲存版本共用同一識別碼。代價見於事件次序：若儲存失敗，寄件人會透過送達確認得知，但收件人已經看過該訊息。兩項改動均於 2026 年 4 月 15 日完成。',
      ),
    },
    {
      title: bi('Telling “connected” from “registered”', '分辨「已連線」與「已登記」'),
      problem: bi(
        'The chat server accepts a room join only from a socket that has registered with a verified token, so a socket that has merely connected is not enough. The iOS app also depends on two services, the socket server and the REST API, and either can be down.',
        '聊天伺服器只接受已用驗證權杖完成登記的 socket 加入聊天室，所以僅僅連上線並不足夠。iOS 應用程式亦同時倚賴 socket 伺服器與 REST API 兩項服務，任何一方都可能失靈。',
      ),
      decision: bi(
        'The chat screen loads history over REST first as a baseline, then waits up to about five seconds for the socket to report that it is registered, not merely connected. If it registers, the screen joins the room and listens live; if not, it polls the REST API every three seconds. A connection listener switches between the two in either direction, a dropped live stream triggers one reconnect attempt before polling resumes, and a toast tells the user which mode they are in.',
        '聊天畫面先以 REST 載入歷史訊息作為基準，再等待最多約五秒，直至 socket 回報「已登記」而不只是「已連線」。登記成功便加入聊天室並即時接收；否則每三秒向 REST API 輪詢一次。連線監聽器可雙向切換兩種模式，即時連線中斷時會先嘗試重新連線一次才恢復輪詢，並以提示告知用戶目前的模式。',
      ),
      result: bi(
        'The conversation stays readable when the socket fails, and it returns to live mode when the socket comes back. Image attachments need a live socket, so they are unavailable while the app is polling. This is read from the source, and no automated test covers it.',
        'Socket 失效時對話仍可閱讀，socket 恢復後會回到即時模式。圖片附件需要即時 socket，因此輪詢期間無法傳送。此為閱讀原始碼所得，沒有自動化測試涵蓋。',
      ),
    },
    {
      title: bi('Checking a payment before the advert form opens', '付款核實後才開啟廣告表單'),
      problem: bi(
        'Payment happens on Stripe’s hosted page, outside the app, and the redirect back proves nothing on its own: the owner may have closed the page, and a paid session could belong to another purchase or another restaurant.',
        '付款在 Stripe 的託管頁面完成，不在應用程式內，單靠跳轉回來的連結並不能證明任何事：東主可能中途關閉頁面，已付款的工作階段也可能屬於另一項消費或另一間餐廳。',
      ),
      decision: bi(
        'The iOS app routes the pourrice://store return into the advert sheet, checks that the session identifier has the shape of a Checkout Session, and asks the API for that session. The API returns only sessions that belong to the signed-in user. The app then requires three things before the form appears: the session is paid, it is an advertisement payment, and its restaurant is the one being advertised. A verified session is kept for two hours, so an owner who leaves the app can resume.',
        'iOS 應用程式把 pourrice://store 的返回連結交給廣告畫面，先檢查工作階段識別碼是否符合 Checkout Session 的格式，再向 API 查詢該工作階段；API 只會回傳屬於當前登入用戶的工作階段。其後應用程式須確認三件事才顯示表單：工作階段已付款、屬廣告付款，而且所屬餐廳正是要刊登廣告的那一間。核實通過的工作階段會保留兩小時，離開應用程式的東主可以繼續。',
      ),
      result: bi(
        'In the advert sheet the form step is set in one place, after the check passes; a failed or unpaid check returns the owner to the payment step. This is the iOS client’s check, read from the source, and no automated test covers it. The web and Android clients are not claimed to match it.',
        '在廣告畫面中，表單步驟只會在核實通過後設定；核實失敗或未付款，東主會回到付款步驟。這是 iOS 客戶端的檢查，從原始碼閱讀所得，沒有自動化測試涵蓋。網頁及 Android 客戶端不聲稱有同樣的檢查。',
      ),
    },
    {
      title: bi('Treating the database as untrusted input to Gemini', '把資料庫內容視為不可信的 Gemini 輸入'),
      problem: bi(
        'Once the API read the restaurant and menu itself, free-text fields that restaurant owners can edit began to flow straight into Gemini prompts, so a crafted record could carry instructions of its own.',
        'API 改為自行讀取餐廳及餐牌之後，東主可編輯的自由文字欄位便直接流入 Gemini 提示詞，一筆精心設計的紀錄就可能夾帶指令。',
      ),
      decision: bi(
        'Every owner-editable string that enters a prompt (names, districts, keywords, menu item names, opening hours and contacts) passes through one function that flattens line breaks, removes quote marks, braces and markup tags, and caps the length. A prompt holds at most 40 menu items. The raw record stays untouched for numeric and ownership checks. Chat history roles are limited to the two valid values, and a malformed turn is logged by position and role only, so chat content stays out of the logs.',
        '凡進入提示詞的東主可編輯文字（名稱、地區、關鍵字、餐牌項目名稱、營業時間及聯絡資料），都先經同一個函式處理：壓平換行、移除引號、花括號及標記標籤，並限制長度；提示詞最多包含 40 個餐牌項目。原始紀錄保持不變，供數值及擁有權檢查使用。對話歷史的角色只容許兩個有效值，格式不正確的輪次只記錄其位置及角色，令聊天內容不會進入日誌。',
      ),
      result: bi(
        'The change was merged as pull request 21 on 9 April 2026. An automated reviewer left 15 inline comments on it, and later commits on the branch respond to that review. The same review caught token counts that had been silently reading as zero. This is input filtering, not a guarantee against prompt injection.',
        '該改動於 2026 年 4 月 9 日以第 21 號拉取請求合併。一個自動審查機器人在其上提出 15 則行內意見，分支上其後的提交亦回應了該審查。審查亦發現詞元用量一直靜默讀成零。這屬於輸入過濾，並非防禦提示注入的保證。',
      ),
    },
    {
      title: bi('One payment library that took the whole API down', '一個付款函式庫拖垮整個 API'),
      problem: bi(
        'All thirteen routers share one serverless function, so an error thrown while a module loads takes every route down. The Stripe library’s constructor throws when it is given no payment key, and the function crashed at start-up with no log lines at all, as the fixing commit records.',
        '十三個路由器共用同一個無伺服器函式，模組載入時一旦拋出錯誤，所有路由都會失效。缺少付款金鑰時，Stripe 函式庫的建構函式會拋出錯誤，函式於啟動時崩潰，完全沒有日誌，修正提交的說明如此記錄。',
      ),
      decision: bi(
        'The first fix checked for the key before building the client and put a guard in front of the payment router that answers 503 when payments are not configured. The next day the client was made fully lazy, built on its first request, because the environment could not be relied on at module load.',
        '第一次修正在建構客戶端前先檢查金鑰，並在付款路由器前加設守衛，未設定付款時回應 503。翌日再改為延遲建立：付款客戶端在第一次請求時才建構，因為載入模組時環境設定未必已就緒。',
      ),
      result: bi(
        'A payment misconfiguration now costs payments only, and the other routes keep answering. The cause is as the fixing commits record it and was not reproduced. The fixes landed on 25 and 26 March 2026.',
        '付款設定出錯現在只會影響付款，其他路由照常回應。成因依修正提交的記錄，並未重現。兩次修正分別在 2026 年 3 月 25 日及 26 日完成。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('Three checks on a Checkout session', '對 Checkout 工作階段的三項檢查'),
      path: 'Pour Rice/Core/Services/AdvertisementService.swift',
      language: 'swift',
      url: 'https://github.com/Test-Plus-XD/iOS-Assignment/blob/126ec0336286705f57e71f2b74f7a222559c573e/Pour%20Rice/Core/Services/AdvertisementService.swift#L171-L185',
      code: `        let session = try await fetchStripeCheckoutSession(id: sessionId)

        guard session.isPaid else {
            throw AdvertisementPaymentError.unpaid
        }

        guard session.paymentType == "advertisement" || session.metadata?["paymentType"] == "advertisement" else {
            throw AdvertisementPaymentError.wrongPaymentType
        }

        guard session.metadata?["restaurantId"] == restaurantId else {
            throw AdvertisementPaymentError.wrongRestaurant
        }

        return session`,
      note: bi(
        'The session is fetched from the API, then must be paid, must be an advertisement payment and must belong to the restaurant being advertised. These checks run in the iOS app.',
        '應用程式先向 API 取得工作階段，其後須已付款、屬廣告付款，並屬於正在刊登廣告的餐廳。這些檢查在 iOS 應用程式內執行。',
      ),
    },
    {
      title: bi('Waiting for registration, not just connection', '等待登記，而不只是連線'),
      path: 'Pour Rice/ViewModels/ChatRoomViewModel.swift',
      language: 'swift',
      url: 'https://github.com/Test-Plus-XD/iOS-Assignment/blob/126ec0336286705f57e71f2b74f7a222559c573e/Pour%20Rice/ViewModels/ChatRoomViewModel.swift#L187-L197',
      code: `        // Wait for socket to register (up to ~5 seconds)
        // Must wait for isRegistered, not just isConnected, because the server
        // rejects join-room requests from unregistered sockets
        var registered = false
        for _ in 0..<50 {
            try? await Task.sleep(nanoseconds: 100_000_000) // 100ms
            if socketService.isRegistered {
                registered = true
                break
            }
        }`,
      note: bi(
        'The loop checks every 100 ms for up to about five seconds. A registered socket joins the room; otherwise the screen falls back to polling the REST API.',
        '此循環每 100 毫秒檢查一次，最多約五秒；登記成功便加入聊天室，否則改為輪詢 REST API。',
      ),
    },
  ],
};

export default caseFile;
