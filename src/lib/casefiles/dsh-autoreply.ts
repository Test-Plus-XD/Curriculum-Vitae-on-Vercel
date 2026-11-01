import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Evidence for the DeepSeek Harness Discord plugin, read from the public repository at commit c15dc08.
const caseFile: CaseFile = {
  role: bi(
    "Committed and published the plugin as the repository's only contributor, with AI coding assistance: Claude is the credited co-author on 8 of the 9 commits, and the README also credits DeepSeek Harness. All nine commits fall on one day.",
    '以程式庫唯一貢獻者的身分提交及發佈此外掛，並使用 AI 編程輔助：9 次提交中有 8 次列明 Claude 為共同作者，README 亦註明 DeepSeek Harness 的協助。全部 9 次提交均在同一天完成。',
  ),
  facts: [
    { value: 872, label: bi('lines of TypeScript code', '行 TypeScript 程式碼') },
    { value: 0, label: bi('npm dependencies', '個 npm 依賴套件') },
    { value: 9, label: bi('commits, all on one day', '次提交，全部在同一天') },
    { value: 8, suffix: '/9', label: bi('commits co-authored with Claude', '次提交與 Claude 共同撰寫') },
    { value: 3, label: bi('README languages, ban warning at the top', '種語言的 README，開頭均載封禁警告') },
  ],
  flow: [
    {
      name: bi('Discord desktop client', 'Discord 桌面用戶端'),
      note: bi(
        "Runs with a debugging port restricted to this computer; a bridge injected into the page reports other people's new messages.",
        '以僅限本機的除錯連接埠運行；注入頁面的橋接程式會回報其他人傳來的新訊息。',
      ),
      link: bi('New message, over the local port', '新訊息經本機連接埠傳送'),
    },
    {
      name: bi('Plugin core', '外掛核心'),
      note: bi(
        'Answers the open chat by default, removes links, keeps each chat in order and adds earlier messages as context.',
        '預設只回應當前聊天室，並移除連結、按聊天室維持訊息次序，以及附上較早的訊息作為上下文。',
      ),
      link: bi('Prompt, queued per chat', '提示按聊天室排隊'),
    },
    {
      name: bi('Harness session', 'Harness 工作階段'),
      note: bi(
        'One session per chat, with a persona prompt and a local style file. A guard refuses every tool call.',
        '每個聊天室一個工作階段，配合人設提示及本機風格檔。工具防護會拒絕所有工具呼叫。',
      ),
      link: bi("Model request, through the user's account", '經用戶帳戶發出模型請求'),
    },
    {
      name: bi('DeepSeek model', 'DeepSeek 模型'),
      note: bi(
        'Reached through the DeepSeek account, not run locally: messages and images leave this computer for the model.',
        '經 DeepSeek 帳戶存取，並非在本機運行：訊息及圖片會離開這部電腦，傳送至模型。',
      ),
      link: bi('Finished reply', '完成的回覆'),
    },
    {
      name: bi('Discord message box', 'Discord 訊息輸入框'),
      note: bi(
        "By default the reply goes into that chat's message box or saved draft, and the plugin stops there.",
        '預設情況下，回覆會放入該聊天室的訊息輸入框或已儲存的草稿，外掛的工作亦至此為止。',
      ),
      link: bi('Read, edit, press Enter', '閱讀、修改、按 Enter'),
    },
    {
      name: bi('The user', '用戶'),
      note: bi(
        "Decides whether the reply goes out. Automatic sending is opt-in, and either way automating a user account is against Discord's Terms of Service.",
        '由用戶決定是否發出回覆。自動發送須自行開啟；無論採用哪種方式，自動化操作用戶帳戶均違反 Discord 服務條款。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi("Friends' messages must never reach a tool", '朋友的訊息絕不能觸及工具'),
      problem: bi(
        "Every incoming Discord message becomes a prompt to an agent, on a computer where other plugins attach shell, terminal and memory tools to every session. Friends' messages therefore have to be treated as untrusted input.",
        '每則收到的 Discord 訊息都會成為代理程式的提示，而同一部電腦上的其他外掛會為每個工作階段加入 Shell、終端機及記憶工具。因此，朋友的訊息必須一律視為不可信輸入。',
      ),
      decision: bi(
        'Two layers. Tools are hidden from each Discord session, which also keeps prompts small, and a guard at harness level refuses every tool call from those sessions. The guard is the real boundary, because some agent-scoped tools cannot be hidden.',
        '設置兩層防線。先向每個 Discord 工作階段隱藏工具，同時令提示保持精簡；再由 Harness 層面的防護拒絕這些工作階段的所有工具呼叫。部分工具屬代理程式範圍，無法隱藏，故真正的安全邊界是這道防護。',
      ),
      result: bi(
        "As the code stands, these sessions can call no tools, so the model's only output is text. The guard dates from the first commit, and the project's notes say never to weaken it. It covers tool calls only; it is not a claim about everything the model can see.",
        '按現有程式碼，這些工作階段無法呼叫任何工具，模型只能輸出文字。防護自首次提交起已經存在，項目文件亦註明不得削弱。它只涵蓋工具呼叫，並不代表模型所見的一切內容均受限制。',
      ),
    },
    {
      title: bi('The last step stays with a person', '最後一步留給用戶'),
      problem: bi(
        "A reply written by a model would reach a friend from a real person's account. With nobody reading it first, the user would be answering for text they had never seen.",
        '回覆由模型撰寫，卻會以真人的帳戶傳給朋友。若無人先行過目，用戶便要為自己從未看過的文字負責。',
      ),
      decision: bi(
        "Delivery defaults to draft: the text goes into the chat's message box and the plugin stops. Automatic sending is a mode the user must switch on, and that one setting also controls the local API's send route, which otherwise returns 403.",
        '傳遞方式預設為草稿：文字放入該聊天室的訊息輸入框後，外掛即告停止。自動發送須由用戶自行開啟，而同一設定亦控制本機 API 的發送路由，未開啟時一律回傳 403。',
      ),
      result: bi(
        "By default nothing is posted until the user reads the draft and presses Enter. That is a safety default, not permission: automating a user account is against Discord's Terms of Service, the README warns that it can get the account banned, and draft mode does not change that.",
        '預設情況下，用戶閱讀草稿並按下 Enter 之前，不會發出任何內容。這只是安全預設，並非許可：自動化操作用戶帳戶違反 Discord 服務條款，README 亦警告帳戶可能因此被封禁，草稿模式不會改變這一點。',
      ),
    },
    {
      title: bi('TypeScript with no toolchain, and the assumption that broke', '沒有工具鏈的 TypeScript，以及失效的假設'),
      problem: bi(
        "The project wanted TypeScript and no npm dependencies, and the page bridge has to stay a single expression because it is evaluated inside Discord's page.",
        '項目希望使用 TypeScript 而不依賴任何 npm 套件，而頁面橋接程式須在 Discord 頁面內求值，因此必須維持為單一表達式。',
      ),
      decision: bi(
        "The rewrite relied on Node stripping types at load time, with no build step. GitHub installs land in node_modules, where Node will not do that, so a 25-line build script using Node's own stripper now writes a committed dist folder, and the bridge loads the prebuilt file first.",
        '重寫時依靠 Node 在載入時剝離型別，不設建構步驟。但從 GitHub 安裝的套件會放在 node_modules，Node 不會在該處剝離型別；於是改用 25 行建構腳本，以 Node 內置的剝離功能生成 dist 資料夾並一併提交，橋接程式則優先載入預先建構的檔案。',
      ),
      result: bi(
        'The package still has no npm dependencies. The costs are that dist must be committed with the sources and that nothing type-checks the code: the types serve editors only.',
        '套件仍然沒有任何 npm 依賴。代價是 dist 須與原始碼一併提交，而且沒有任何工具檢查型別：型別只供編輯器使用。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('A draft reaches the message box', '草稿進入訊息輸入框'),
      path: 'page-bridge.ts',
      language: 'typescript',
      url: 'https://github.com/Test-Plus-XD/DSH-Discord-AutoReply/blob/c15dc0809b49f9d335601568ea632965945f323f/page-bridge.ts#L100-L112',
      code: [
        "    state.draft = (channelId, text) => {",
        "      const existing: string = drafts.getDraft(channelId, 0) ?? ''",
        "      const addition = existing.trim() ? `\\n${text}` : text",
        "      const box = selected.getChannelId() === channelId ? componentDispatch() : undefined",
        "      if (box) {",
        "        // The open message box: type at the cursor, like a paste.",
        "        box.dispatchToLastSubscribed('INSERT_TEXT', { plainText: addition, rawText: addition })",
        "        return 'inserted'",
        "      }",
        "      // Another chat: append to its saved draft, shown when you open it.",
        "      draftActions.changeDraft(channelId, existing + addition, 0)",
        "      return 'drafted'",
        "    }",
      ].join('\n'),
      note: bi(
        'Draft delivery in full: the text is inserted into the open box or saved to another chat, and no send call appears. Sending is a separate method, used only when send mode is on.',
        '這就是草稿傳遞的全部：文字插入當前的輸入框，或儲存至其他聊天室，當中沒有任何發送呼叫。發送是另一個方法，只在開啟發送模式時使用。',
      ),
    },
    {
      title: bi('The tool guard', '工具防護'),
      path: 'index.ts',
      language: 'typescript',
      url: 'https://github.com/Test-Plus-XD/DSH-Discord-AutoReply/blob/c15dc0809b49f9d335601568ea632965945f323f/index.ts#L241-L252',
      code: [
        "  // Friends' messages must never drive tools (shell, files, memory, teammates...).",
        "  // The guard is the hard stop; hiding the tools also keeps prompts small.",
        "  const isDiscordSession = (id: string): boolean => {",
        "    if (state.owned.includes(id)) return true",
        "    try {",
        "      const session = ctx.get('sessions')?.get(id)",
        "      const preset = session ? controller().agents.presetForSession(session) : undefined",
        "      return (typeof preset === 'object' ? preset.id : preset) === config.agentPreset",
        "    } catch { return false }",
        "  }",
        "  ctx.effect(() => ctx.tools.guard(exec => exec.agent !== undefined && isDiscordSession(exec.agent.id)",
        "    ? 'Tools are disabled in Discord auto-reply sessions.' : undefined), 'discord-autoreply: tool guard')",
      ].join('\n'),
      note: bi(
        "The guard refuses any tool call from a Discord session, recognised by the plugin's own session list or by its agent preset. Hiding the tools is the second layer, a few lines further down the file.",
        '工具防護會拒絕 Discord 工作階段的任何工具呼叫，並按外掛自身的工作階段清單或代理預設加以識別。隱藏工具是第二層防線，就在檔案下方數行。',
      ),
    },
  ],
};

export default caseFile;
