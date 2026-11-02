import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Case file for the 2D chess game, rechecked against public repository commit fcd28da.
const caseFile: CaseFile = {
  role: bi(
    'Designed the game, wrote the rule specifications, directed and corrected the AI agents, and tuned the scene, levels and assets in Unity. The implementation was heavily AI-assisted: ChatGPT drafted the first pawn scripts in September, and Claude agents produced all 12 merged pull requests.',
    '負責遊戲設計及撰寫規則規格，指揮並修正 AI 代理的工作，再於 Unity 調校場景、關卡及素材。實作大量依賴 AI 協助：九月的首批棋子腳本由 ChatGPT 起草，全部 12 個已合併的拉取請求則由 Claude 代理完成。',
  ),
  facts: [
    { value: 10569, label: bi('lines in project C# files, comments and blanks included', '行專案 C# 檔案內容（包括註解及空行）') },
    { value: 16, label: bi('C# scripts', '個 C# 腳本') },
    { value: 5, label: bi('levels', '個關卡') },
    { value: 4, label: bi('opponent types', '種對手棋子') },
    { value: 5, label: bi('opponent modifiers', '種對手強化效果') },
  ],
  flow: [
    {
      name: bi('Level data', '關卡資料'),
      note: bi(
        'Five ScriptableObject levels set the board size, the opponent mix and the modifier pool.',
        '五個 ScriptableObject 關卡分別設定棋盤大小、對手組合及強化效果範圍。',
      ),
      link: bi('Game Manager loads the level', 'Game Manager 載入關卡'),
    },
    {
      name: bi('Hex board', '六角棋盤'),
      note: bi(
        'HexGrid builds tiles named by their axial coordinates, and the Spawner places the player and opponents.',
        'HexGrid 生成以軸向座標命名的格位，再由 Spawner 放置玩家及對手。',
      ),
      link: bi('A swipe picks a neighbouring tile', '滑動選定相鄰格位'),
    },
    {
      name: bi('Player move', '玩家行動'),
      note: bi(
        'The swipe is matched by dot product against the six neighbouring tiles; landing on an opponent captures it.',
        '以內積比對滑動方向與六個相鄰格位；踏上對手所在格即可吃子。',
      ),
      link: bi('The move hands over to Chequerboard', '行動完成後交由 Chequerboard 接手'),
    },
    {
      name: bi('Opponent turn', '對手回合'),
      note: bi(
        'Armed opponents fire along last turn’s aim, then each opponent moves by weighted random choice and re-aims; targeted tiles blink red.',
        '持槍對手沿上回合的瞄準方向開火，然後各對手以加權隨機方式移動並重新瞄準；被瞄準的格位會閃爍紅色。',
      ),
      link: bi('One opponent left', '只剩一名對手'),
    },
    {
      name: bi('Standoff switch', '切換至對決階段'),
      note: bi(
        'The board switches off, a mirrored arena is generated and the pawns move to platformer physics; a last Basic pawn becomes a Handcannon.',
        '棋盤關閉，系統生成鏡像競技場，棋子改用平台遊戲物理；若最後一枚是 Basic，便換成 Handcannon。',
      ),
      link: bi('Player input sets the time scale', '玩家操作決定時間縮放'),
    },
    {
      name: bi('Real-time duel', '即時對決'),
      note: bi(
        'Time runs while the player acts and eases down to 0.3 when they stop; AI timers, fire intervals and bullets slow with it.',
        '玩家行動時時間如常流逝，停下時逐漸減慢至 0.3；AI 計時、開火間隔及子彈都隨之放慢。',
      ),
      link: bi('The last opponent falls', '最後一名對手倒下'),
    },
    {
      name: bi('Result', '結果'),
      note: bi('Clearing every opponent wins the level; losing the player pawn in either mode ends it in defeat.', '清除所有對手即可過關；玩家棋子在任一模式被擊倒，都會以落敗告終。'),
    },
  ],
  dispatches: [
    {
      title: bi('Mirroring an arena in axial coordinates', '以軸向座標鏡像競技場'),
      problem: bi(
        'The duel arena is built on the right and mirrored to the left. The prototype converted axial coordinates with its own formula, not the board’s, and mirrored by negating q alone, so any tile with r ≠ 0 missed its true reflection.',
        '對決競技場先在右側生成，再鏡像到左側。原型用了一條與棋盤不同的座標換算公式，鏡像時又只把 q 取負，結果凡 r ≠ 0 的格位都落不到真正的鏡像位置。',
      ),
      decision: bi(
        'The rewrite moved the arena onto the board’s flat-top formula, y = s(r + q/2), where s is the tile size. Negating q alone would now shift tiles vertically, so the mirror solves for the coordinate that holds y: q′ = −q, r′ = r + q. The derivation is written in a comment beside the code.',
        '重寫時改用與棋盤相同的平頂公式 y = s(r + q/2)，其中 s 為格位大小。在此公式下只把 q 取負會令格位上下移位，因此鏡像改為求解能保持 y 不變的座標：q′ = −q，r′ = r + q。推導過程就寫在程式碼旁的註解內。',
      ),
      result: bi(
        'Each mirrored tile lands at its exact reflection: x flips and y holds. The fix came in on a Claude agent branch and was merged as pull request 10.',
        '每個鏡像格位都準確落在對稱位置：x 反轉，y 不變。此修正來自 Claude 代理分支，並以第 10 號拉取請求合併。',
      ),
    },
    {
      title: bi('Aiming along hex axes, one turn ahead', '沿六角軸線瞄準，提前一回合預告'),
      problem: bi(
        'Board guns re-aimed every frame, snapping the world-space angle to the player onto the nearest hex direction. A shot therefore followed the player’s latest move, and the chosen line could miss every tile near the player.',
        '棋盤上的槍械每幀重新瞄準，把指向玩家的世界座標角度吸附到最接近的六角方向。因此子彈總是跟着玩家最新的位置，而選出的方向亦可能完全避開玩家附近的格位。',
      ),
      decision: bi(
        'Aim became board arithmetic: walk each of the six axial directions and score every tile in the player’s seven-tile area, so more hits win and nearer hits break ties. With no hit, the gun points straight down. The turn order became fire, move, re-aim, so each shot leaves on the line chosen the turn before.',
        '瞄準改為純棋盤運算：沿六條軸線逐格檢查，為落在玩家七格範圍內的格位評分，命中較多者勝出，同分時距離較近者優先。若全無命中，槍口便指向正下方。回合次序亦改為開火、移動、重新瞄準，每發子彈都沿上一回合選定的方向射出。',
      ),
      result: bi(
        'The same scoring routine turns the gun and marks the tiles that blink red, so the player can see the line and has one move to step off it.',
        '槍械角度與閃爍紅色的預告格位都由同一套評分運算決定，玩家看得見火線，也有一步時間避開。',
      ),
    },
    {
      title: bi('A turn loop that survives pawns dying mid-turn', '棋子中途陣亡也不會中斷的回合循環'),
      problem: bi(
        'Opponents act one at a time with animated moves, bullets can destroy any pawn during that sequence, and two opponents must not choose the same tile.',
        '對手逐一行動，移動有動畫，過程中子彈可能擊毀任何一枚棋子；兩名對手亦不可選中同一格。',
      ),
      decision: bi(
        'The loop walks a snapshot of the opponent list and skips destroyed entries. A shared occupied set frees a pawn’s own tile before it chooses, reserves the target before the animation starts and rolls back if the move cannot start; the player’s tile stays selectable so that capture works. Each move wait times out after 2 s.',
        '循環遍歷對手清單的快照，並略過已被摧毀的項目。共用的佔用集合會在棋子選格前釋放其所在格位，在動畫開始前預留目標格，移動無法開始時則復原；玩家所在格保持可選，吃子才能成立。每步等待設有 2 秒逾時。',
      ),
      result: bi(
        'The snapshot, the occupied set and the 2 s timeout have been in the loop since the scripts were first committed on 16 September. Fleet’s second move (10 December) and the pause checks and 5 s failsafe (22 December) were added around them.',
        '快照、佔用集合及 2 秒逾時自腳本於 9 月 16 日首次提交起便已存在。Fleet 的第二步（12 月 10 日）、暫停檢查及 5 秒保險機制（12 月 22 日）都是後來在其外圍加入。',
      ),
    },
  ],
  exhibits: [
    {
      src: '/images/projects/2d-chess/board-simulator.webp',
      width: 1008,
      height: 933,
      alt: bi(
        'Unity’s phone simulator showing a hexagonal board with one pawn, beside an Inspector listing radius 2, extra row 2 and flat-top orientation.',
        'Unity 手機模擬器顯示一個六角棋盤及一枚棋子，旁邊的 Inspector 列出半徑 2、額外列數 2 及平頂方向。',
      ),
      caption: bi(
        'Early editor capture, 13 September 2025: the board generated from its radius and extra-row settings, seen in Unity’s phone simulator.',
        '2025 年 9 月 13 日的早期編輯器截圖：棋盤按半徑及額外列數設定生成，於 Unity 手機模擬器中顯示。',
      ),
    },
    {
      src: '/images/projects/2d-chess/pawn-customiser.webp',
      width: 602,
      height: 880,
      alt: bi(
        'Unity Inspector listing closest, diagonal, side and farthest movement weights for four pawn types, then minimum and maximum Standoff distances.',
        'Unity Inspector 列出四種棋子的最近、斜向、側向及最遠移動權重，以及對決階段的最短與最長距離。',
      ),
      caption: bi(
        'The Pawn Customiser asset: board movement weights and duel distances for each pawn type, editable without touching code. These values match the last commit.',
        'Pawn Customiser 資產：各種棋子的棋盤移動權重及對決距離，毋須改動程式碼即可調整。圖中數值與最後一次提交相同。',
      ),
    },
    {
      src: '/images/projects/2d-chess/firearm-animation.webp',
      width: 1060,
      height: 245,
      alt: bi(
        'Unity Animation window for the Firearm clip, with keyframes on gun position and rotation and one on the Fire object.',
        'Unity Animation 視窗顯示 Firearm 片段，槍械位置及旋轉設有關鍵影格，Fire 物件亦有一個關鍵影格。',
      ),
      caption: bi(
        'Editor capture, 21 December 2025, of the Firearm animation clip: position and rotation keys on the guns, and one key on the Fire object’s active state.',
        '2025 年 12 月 21 日的編輯器截圖，顯示 Firearm 動畫片段：槍械的位置及旋轉關鍵影格，以及控制 Fire 物件啟用狀態的一個關鍵影格。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('Reflecting an axial coordinate', '反射軸向座標'),
      path: 'Assets/Script/Platform.cs',
      language: 'csharp',
      url: 'https://github.com/Test-Plus-XD/2D-Chess-Project/blob/fcd28da0c3b77fae2dd1a0f682dfa0da405d2897/Assets/Script/Platform.cs#L434-L440',
      code: `            // Calculate mirrored axial coordinates.
            // For FlatTop: x = SQRT_3/2 * tileSize * q, y = tileSize * (r + q/2)
            // To mirror x -> -x, we need: -q for q, but y must remain the same.
            // y' = tileSize * (r' + q'/2) = tileSize * (r + q/2)
            // With q' = -q: r' + (-q)/2 = r + q/2 -> r' = r + q
            int mirrorQ = -tile.axialQ;
            int mirrorR = tile.axialR + tile.axialQ;`,
      note: bi(
        'The reflection is derived in the comment, then applied in two lines. It arrived on a Claude agent branch, merged as pull request 10.',
        '註解先推導反射公式，再以兩行程式碼套用。此段來自 Claude 代理分支，並以第 10 號拉取請求合併。',
      ),
    },
    {
      title: bi('Walking one axial ray', '沿一條軸線逐格檢查'),
      path: 'Assets/Script/Weapon System.cs',
      language: 'csharp',
      url: 'https://github.com/Test-Plus-XD/2D-Chess-Project/blob/fcd28da0c3b77fae2dd1a0f682dfa0da405d2897/Assets/Script/Weapon%20System.cs#L730-L740',
      code: `            for (int step = 1; step <= 999; step++)
            {
                currentQ += PlayerController.HEX_DIR_Q[dirIndex];
                currentR += PlayerController.HEX_DIR_R[dirIndex];
                Vector2Int currentTile = new Vector2Int(currentQ, currentR);

                if (playerArea.Contains(currentTile))
                {
                    score += (1000 - step);
                }
            }`,
      note: bi(
        'Board aim is integer arithmetic with no physics query. This loop runs once for each of the six directions, and each tile in the player’s area adds to that direction’s score.',
        '棋盤瞄準只用整數運算，毋須物理查詢。六個方向各執行一次此循環，玩家範圍內的每個格位都會為該方向加分。',
      ),
    },
  ],
};

export default caseFile;
