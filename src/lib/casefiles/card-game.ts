import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Card Matching Game: figures come from the public NetBeans-Projects source at ae7098a; behaviour is read from that source, not from a run.
const caseFile: CaseFile = {
  role: bi(
    'I wrote this game in Java and Swing and am the only contributor to its repository: the game logic, the self-painting card component and the audio class. All seven commits in that repository fall within 37 minutes on 25 February 2025; five of them are bulk uploads of this game, so they date the publication, not the work.',
    '本人以 Java 及 Swing 編寫此遊戲，亦是程式庫唯一的貢獻者：遊戲邏輯、自繪卡牌元件及音效類別均出自本人。該程式庫的七次提交全部在 2025 年 2 月 25 日的 37 分鐘內完成，其中五次為此遊戲的批次上載，因此只反映發佈日期，並非開發過程。',
  ),
  facts: [
    { value: 517, label: bi('lines of Java', '行 Java 程式碼') },
    { value: 5, label: bi('levels of growing grids', '個關卡，棋盤逐步擴大') },
    { value: 45, label: bi('card pairs across the levels', '對卡牌，分佈於各關卡') },
    { value: 450, label: bi('highest possible score', '最高可得分數') },
    { value: 4, label: bi('Java classes', '個 Java 類別') },
  ],
  flow: [
    {
      name: bi('Deal', '發牌'),
      note: bi('Two of each value go into a list, which is shuffled and laid out as a grid.', '每個數值放入兩張，洗牌後排成棋盤。'),
      link: bi('shuffled values', '洗好的數值'),
    },
    {
      name: bi('Build the board', '建立棋盤'),
      note: bi('Each cell gets its own CardPanel; the level’s music starts and the clock restarts from zero.', '每格建立一個 CardPanel，同時播放該關音樂，計時器由零開始。'),
      link: bi('a card is clicked', '玩家點擊卡牌'),
    },
    {
      name: bi('Flip', '翻牌'),
      note: bi('The flip sound plays and the card animates; the first card of a pair is remembered.', '播放翻牌音效並展開動畫；每對的第一張卡牌會被記下。'),
      link: bi('the second card', '翻開第二張'),
    },
    {
      name: bi('Compare', '比對'),
      note: bi('A match scores 10. A mismatch stays visible for one second with the board locked, and costs a point from level 2 onwards.', '配對成功得 10 分。配對失敗時卡牌會顯示一秒，其間鎖定棋盤；第二關起每次扣 1 分。'),
      link: bi('every card matched', '全部卡牌配對完成'),
    },
    {
      name: bi('Level complete', '過關'),
      note: bi('The clock stops and a dialog reports the time and the score.', '計時停止，對話框顯示所用時間及分數。'),
      link: bi('Next Level', '按下 Next Level'),
    },
    {
      name: bi('Next level', '下一關'),
      note: bi('The grid grows and the window is rebuilt, with the score carried over. Level 5 offers Exit only.', '棋盤擴大，視窗重新建立，分數累積至下一關。第五關只提供 Exit 按鈕。'),
    },
  ],
  dispatches: [
    {
      title: bi('From JButton icons to a card that paints itself', '由 JButton 圖示改為自繪卡牌'),
      problem: bi(
        'An earlier build drew each card as a JButton with an icon, and the one class that built the board also loaded and played the sound.',
        '早期版本以附圖示的 JButton 繪製每張卡牌，建立棋盤的同一個類別亦負責載入及播放音效。',
      ),
      decision: bi(
        'I replaced the buttons with CardPanel, a JPanel that holds its own animation state and paints itself with Graphics2D, and moved audio into a separate Sound class. A turn is faked by scaling the width around the centre and swapping the image at zero width.',
        '本人改用 CardPanel：一個自行保存動畫狀態、以 Graphics2D 繪製自身的 JPanel，並把音效抽出為獨立的 Sound 類別。翻轉效果以繞中心縮放寬度模擬，寬度歸零時才更換圖像。',
      ),
      result: bi(
        'Compiled output left in the repository shows the change: the old class file holds a grid of JButtons, the current one a grid of CardPanels. A flip runs 41 ticks of a 5 ms timer, nominally 205 ms, and CardPanel.java is 158 lines.',
        '程式庫中遺留的編譯檔記錄了這次改動：舊類別檔保存的是 JButton 陣列，現行版本則是 CardPanel 陣列。一次翻牌為 5 毫秒計時器的 41 個週期，名義上 205 毫秒；CardPanel.java 共 158 行。',
      ),
    },
    {
      title: bi('Never dealing an odd card', '絕不發出單數卡牌'),
      problem: bi(
        'Levels grow by adding a row, then a column, in turn. That sequence reaches 3 × 5 at level 3: 15 cards, which a deck built in pairs cannot fill.',
        '關卡輪流增加一行及一列，到第三關會變成 3 × 5，即 15 張卡牌，而以成對方式組成的牌組無法填滿。',
      ),
      decision: bi(
        'After each step the game tests ROWS * COLS for an odd total and, if it finds one, adds another column. It is a single check, with no table of level sizes.',
        '每次擴大後，遊戲檢查 ROWS * COLS 是否為單數，如是則再加一列。只需一項檢查，毋須另設關卡尺寸表。',
      ),
      result: bi(
        'The five grids run 2 × 4, 3 × 4, 3 × 6, 4 × 6 and 4 × 7, from 8 to 28 cards, all even. Level 3 is the only level where the check changes anything.',
        '五個棋盤依次為 2 × 4、3 × 4、3 × 6、4 × 6 及 4 × 7，由 8 張增至 28 張，全為雙數。只有第三關會觸發這項檢查。',
      ),
    },
    {
      title: bi('A one-second look at a mismatch', '讓玩家看清配對失敗的一秒'),
      problem: bi(
        'After two mismatched cards the player needs a moment to see them, and a third click in that moment would corrupt the selection. Sleeping on the event-dispatch thread would freeze the animation.',
        '翻開兩張不相配的卡牌後，玩家需要片刻看清，而這段時間若再點擊第三張，便會打亂選取狀態。若在事件分派執行緒上休眠，動畫亦會停頓。',
      ),
      decision: bi(
        'An isProcessing flag rejects clicks, and a one-shot Swing Timer turns both cards back after one second. Swing timers fire on the event-dispatch thread, so the stored first-card position needs no further locking.',
        '以 isProcessing 旗標拒絕點擊，再由單次觸發的 Swing Timer 於一秒後把兩張卡牌翻回。Swing Timer 在事件分派執行緒上觸發，因此記下的第一張卡牌位置毋須額外加鎖。',
      ),
      result: bi(
        'The reveal delay needs no extra thread and does not hold the event-dispatch thread. The flip sound is a separate case: clip.drain() still waits on that thread until the 0.395-second effect ends, as read from the source, not timed.',
        '這段延遲毋須額外執行緒，也不會佔住事件分派執行緒。翻牌音效則是另一回事：clip.drain() 仍會在該執行緒上等待 0.395 秒的音效播完；此點由原始碼讀出，並未實測。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('The flip state machine', '翻牌狀態機'),
      path: 'CardMatchingGame/src/main/java/com/mycompany/cardmatchinggame/CardPanel.java',
      language: 'java',
      url: 'https://github.com/Test-Plus-XD/NetBeans-Projects/blob/ae7098a88f61bd9df0388ca139d31a7d0589cf94/CardMatchingGame/src/main/java/com/mycompany/cardmatchinggame/CardPanel.java#L62-L78',
      code: `        timer.addActionListener(e -> {
            if (animationStep > 0 && !isFlipped) {
                // Shrink phase
                animationStep -= 5; // Decrease width percentage
            } else if (animationStep <= 0 && !isFlipped) {
                // Flip to the front
                isFlipped = true;
                animationStep = 5; // Start expanding
            } else if (animationStep < 100 && isFlipped) {
                // Expand phase
                animationStep += 5; // Increase width percentage
            } else {
                // Stop the animation when fully expanded
                ((Timer) e.getSource()).stop();
            }
            repaint(); // Repaint the panel for the next animation frame
        });`,
      note: bi(
        'One integer and one flag fake the turn: the face changes at zero width, where the player cannot see it.',
        '只用一個整數及一個旗標模擬翻轉：牌面在寬度歸零時更換，玩家看不見這一刻。',
      ),
    },
    {
      title: bi('The odd-card check', '單數卡牌檢查'),
      path: 'CardMatchingGame/src/main/java/com/mycompany/cardmatchinggame/CardMatchingGame.java',
      language: 'java',
      url: 'https://github.com/Test-Plus-XD/NetBeans-Projects/blob/ae7098a88f61bd9df0388ca139d31a7d0589cf94/CardMatchingGame/src/main/java/com/mycompany/cardmatchinggame/CardMatchingGame.java#L241-L251',
      code: `        // Alternate between increasing ROWS and COLS
        if (level % 2 == 1) {
           COLS++;
        } else {
           ROWS++;
        }
        
        // Ensure ROWS * COLS is always even
        if ((ROWS * COLS) % 2 != 0) {
            COLS++; // Increment COLS to make the total even
        }`,
      note: bi(
        'The grid grows by one fixed step, and the second test keeps the card count even for a deck dealt in pairs.',
        '棋盤按固定步驟擴大，第二項檢查則確保卡牌總數為雙數，配合成對發牌。',
      ),
    },
  ],
};

export default caseFile;
