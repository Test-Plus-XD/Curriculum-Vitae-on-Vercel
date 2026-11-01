import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Zuul's source sits unpublished in the owner's local NetBeans folder, so this file holds prose and counts only: no excerpts, exhibits or links.
const caseFile: CaseFile = {
  role: bi(
    'I extended World of Zuul, the teaching project from Barnes and Kölling’s Objects First with Java, into my own quest: its map, items and weights, back command, NPC and separate view class. The command parser keeps the textbook’s form, and my source is not published.',
    '本人在 Barnes 與 Kölling《Objects First with Java》的教學項目 World of Zuul 上，擴展出自己的冒險任務：地圖、物品及負重、返回指令、NPC 及獨立的視圖類別。指令解析器沿用教材的寫法，本人的原始碼未有公開。',
  ),
  facts: [
    { value: 10, label: bi('rooms on the map', '個地圖房間') },
    { value: 6, label: bi('items', '件物品') },
    { value: 9, label: bi('player commands', '個玩家指令') },
    { value: 8, label: bi('Java classes', '個 Java 類別') },
    { value: 820, label: bi('lines of Java, textbook code included', '行 Java 程式碼，包括教材部分') },
  ],
  flow: [
    {
      name: bi('Read a line', '讀取一行輸入'),
      note: bi('Parser keeps the first two words and checks the first against the nine command words.', 'Parser 保留首兩個詞，並以第一個詞對照九個指令詞。'),
      link: bi('a Command object', 'Command 物件'),
    },
    {
      name: bi('Dispatch', '分派指令'),
      note: bi('A switch in Zuul sends the command to its handler; anything unknown gets a hint to type help.', 'Zuul 以 switch 把指令交給對應的處理方法；無法辨識時提示玩家輸入 help。'),
      link: bi('the matching handler', '對應的處理方法'),
    },
    {
      name: bi('Change the game state', '更新遊戲狀態'),
      note: bi('Handlers move the player, carry items within a weight limit of 10, or hand the fruit to the NPC.', '處理方法負責移動玩家、在負重上限 10 以內攜帶物品，或把果實交給 NPC。'),
      link: bi('the new room or a message', '新房間或訊息'),
    },
    {
      name: bi('Print', '顯示結果'),
      note: bi('GameView prints the room, its items and NPC, and each exit with the name of the room behind it.', 'GameView 顯示房間、其中的物品及 NPC，並列出每個出口通往的房間名稱。'),
      link: bi('on entering a room', '進入房間時'),
    },
    {
      name: bi('Check for a win', '判定勝負'),
      note: bi('Walking into the Triumph Sanctum with the relic ends the game; without it, the game says the relic is missing.', '帶着聖物走進 Triumph Sanctum 即告勝利；未帶聖物則會提示聖物尚未取得。'),
    },
  ],
  dispatches: [
    {
      title: bi('A relic that starts off the map', '起初不在地圖上的聖物'),
      problem: bi(
        'With the relic lying in the vault, a player could walk in, take it, step one room east into the sanctum and win, and the rest of the map would not matter. The line that once placed it there is still in the source, commented out.',
        '聖物若放在寶庫內，玩家走進去拿起，再往東走一個房間進入聖殿便可獲勝，地圖其餘部分便失去意義。原本放置聖物的一行至今仍以註解形式留在原始碼中。',
      ),
      decision: bi(
        'I kept the relic out of every room until the player gives the Starving Warden the Elderfruit from the Alchemist’s Hearth. He then leaves the vault and the relic appears there.',
        '本人讓聖物不放在任何房間，直至玩家把 Alchemist’s Hearth 的 Elderfruit 交給 Starving Warden。守衛隨即離開寶庫，聖物才在該處出現。',
      ),
      result: bi(
        'Winning now requires the fetch quest. By the map, the shortest win is 11 commands: eight moves, taking the fruit, giving it and taking the relic.',
        '如今必須先完成取物任務才能獲勝。按地圖計算，最短的勝利路線為 11 個指令：八次移動，加上取得果實、交出果實及取得聖物。',
      ),
    },
    {
      title: bi('A back command with a real history', '有真實記錄的返回指令'),
      problem: bi(
        'Exits only name neighbouring rooms, so nothing records how the player got somewhere, and the map is a branching tree with dead ends such as the Mossbound Garden.',
        '出口只記錄相鄰房間，並無保存玩家走過的路線，而地圖呈樹狀分支，且有 Mossbound Garden 這類盡頭。',
      ),
      decision: bi(
        'Every successful move pushes the current room onto a Stack before the player leaves it. The back command pops the last room and pushes nothing.',
        '每次成功移動前，先把目前房間推入 Stack；back 指令則取出上一個房間，不再推入任何記錄。',
      ),
      result: bi(
        'Repeated back commands retrace the route one room at a time, all the way to the start, and then report that there is no previous room.',
        '連續輸入 back 可逐房間沿路折返直至起點，之後遊戲會提示已無上一個房間。',
      ),
    },
    {
      title: bi('Keeping messages out of the rules', '把訊息與規則分開'),
      problem: bi(
        'A console game easily scatters print statements through its rules, which ties the wording of every message to the logic around it.',
        '主控台遊戲的輸出語句很容易散落在規則之間，令每段訊息都與周圍的邏輯綁在一起。',
      ),
      decision: bi(
        'I added GameView, a class of 19 print methods, as the view in an MVC-style split. Zuul holds the rules and game state and calls the view; Room, Item and NPC mostly hold the data.',
        '本人加入 GameView，共 19 個輸出方法，作為 MVC 式分層的視圖。Zuul 負責規則及遊戲狀態並呼叫視圖，Room、Item 及 NPC 則主要保存資料。',
      ),
      result: bi(
        'Room, movement, item, inventory and ending messages all go through GameView. The split is partial: the give command’s messages and the Warden’s lines still print from Zuul, NPC and Room.',
        '房間、移動、物品、物品欄及結局訊息全部經由 GameView 輸出。不過分層並不徹底：give 指令的訊息及守衛的對白仍由 Zuul、NPC 及 Room 直接輸出。',
      ),
    },
  ],
};

export default caseFile;
