import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// The evidence behind Milk Tea Mayhem, checked against the public repository at commit 23bdf28; no sprite art is shown because its origin is unproven.
const caseFile: CaseFile = {
  role: bi(
    'Sole human author of the repository’s commits: built the C# systems, the Unity scene and the ladle animation. AI coding assistants were set up from October 2025 (Copilot and AGENTS.md instruction files, plus a CLAUDE.md written with Claude); the history does not show which code they touched.',
    '本人是此儲存庫全部提交的唯一人類作者，負責 C# 系統、Unity 場景及湯勺動畫。自 2025 年 10 月起，儲存庫已設有 AI 編程助手的設定（Copilot 及 AGENTS.md 指引檔，另有與 Claude 合寫的 CLAUDE.md），但提交紀錄未有顯示它們涉及哪些程式碼。',
  ),
  facts: [
    { value: 2331, label: bi('lines of C# code', '行 C# 程式碼') },
    { value: 60, label: bi('seconds on the clock', '秒倒數時間') },
    { value: 12, label: bi('C# scripts', '個 C# 腳本') },
    { value: 137, label: bi('tooltipped Inspector fields', '個附提示的 Inspector 欄位') },
    { value: 22, label: bi('coroutines', '個協程') },
    { value: 20, label: bi('commits', '次提交') },
  ],
  flow: [
    {
      name: bi('Player input', '玩家操作'),
      note: bi(
        'Controller reads touch or mouse each frame, draws the line through the chain and moves the camera.',
        'Controller 每幀讀取觸控或滑鼠位置，沿連線繪出線條並移動鏡頭。',
      ),
      link: bi('Press, hold and release positions', '按下、按住及放開的位置'),
    },
    {
      name: bi('Chain rules', '連線規則'),
      note: bi(
        'Logic takes the topping under the finger if its type fits and no other flavour lies in the path.',
        'Logic 檢查手指下的配料：種類相符，而且路徑上沒有其他口味阻擋，才會加入連線。',
      ),
      link: bi('Three or more links on release', '放開時有三個或以上連結'),
    },
    {
      name: bi('Clear', '消除'),
      note: bi(
        'Toppings go 0.1 s apart; a chained pudding bomb also clears the toppings within 4 units.',
        '配料每隔 0.1 秒逐一消除；連線中的布甸炸彈更會清除半徑 4 單位內的配料。',
      ),
      link: bi('Bombs report their clears through an event', '炸彈以事件回報消除數量'),
    },
    {
      name: bi('Score and rewards', '計分及獎勵'),
      note: bi(
        '10 points per topping, ×2 from 6 links and ×3 from 9, with a bomb from 7 links and 5 extra seconds from 9.',
        '每件配料 10 分，6 連起乘 2，9 連起乘 3；7 連起獲炸彈，9 連起加時 5 秒。',
      ),
      link: bi('One combined refill request', '一次過提出補料要求'),
    },
    {
      name: bi('Refill queue', '補料佇列'),
      note: bi(
        'Spawner adds requests to one counter that a single coroutine drains, and tops the cup up to 25 toppings after each batch.',
        'Spawner 把要求累加到同一計數器，由單一協程逐步處理，並在每批補料後把杯中配料補足至 25 件。',
      ),
      link: bi('New toppings stick to the ladle', '新配料黏在湯勺上'),
    },
    {
      name: bi('Ladle run', '湯勺動作'),
      note: bi(
        'A keyframed clip carries them to the cup with the lid hidden, then they return to physics.',
        '關鍵影格動畫把配料送到杯口，期間隱藏杯蓋，然後交還物理引擎。',
      ),
      link: bi('Toppings join the moving board', '配料回到不斷變動的棋盤'),
    },
    {
      name: bi('Moving board', '變動的棋盤'),
      note: bi(
        'A motorised straw stirs the tea and gusts of wind push toppings about, so the chains on offer keep changing.',
        '馬達飲管不斷攪動奶茶，陣風又把配料吹開，可連的路線因而不斷改變。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi('Riding a keyframed ladle', '讓物理配料乘上關鍵影格湯勺'),
      problem: bi(
        'Refills arrive by ladle, but the ladle moves on Animator keyframes while toppings are free Rigidbody2D bodies. Left alone they would slide off or fight the animation.',
        '補料要由湯勺送入杯中，但湯勺由 Animator 關鍵影格驅動，配料卻是自由的 Rigidbody2D 物體。若不處理，配料會滑落，或與動畫互相牽扯。',
      ),
      decision: bi(
        'On touching the ladle’s collider, a topping turns its own simulation off, zeroes its velocity and parents itself to the ladle, so the clip carries it. During the run the spawner polls every 0.05 s and releases the toppings when the clip turns the collider off, with a midpoint timer as a fallback.',
        '配料一碰到湯勺的碰撞體，便停用自身的物理模擬、把速度歸零，並成為湯勺的子物件，由動畫帶動。動作期間，Spawner 每 0.05 秒檢查一次，待動畫關閉碰撞體便釋放配料，另設中段計時作後備。',
      ),
      result: bi(
        'Refills reach the cup on the clip and drop in as ordinary physics bodies. With the values saved in the scene, the 0.9 s midpoint comes before the clip’s 1.0 s key, so the timer normally does the release.',
        '補料隨動畫抵達杯口，再以普通物理物體落入杯中。按場景內儲存的數值，0.9 秒的中段計時早於動畫 1.0 秒的關鍵影格，因此通常由計時器負責釋放。',
      ),
    },
    {
      title: bi('One refill for a chain and its blast', '連線與爆炸共用一次補料'),
      problem: bi(
        'On 13 November, Logic refilled only the chain’s own length and Bomb had no route to the spawner, so nothing a bomb cleared was replaced. A bomb clears its victims 0.05 s apart, so its count is unknown when the finger lifts.',
        '11 月 13 日的版本中，Logic 只按連線長度補料，Bomb 亦無法接觸 Spawner，炸彈清除的配料因此得不到補充。炸彈每隔 0.05 秒清除一件配料，手指放開時還未知道總數。',
      ),
      decision: bi(
        'Bomb gained a static Exploded event. Logic adds each report to a pending count, waits after the clears and makes one SpawnMore call for the total. SpawnMore only raises a counter that one coroutine drains, so a request made during a run waits its turn instead of starting a second one.',
        'Bomb 新增靜態事件 Exploded。Logic 把每次回報累加到待補數量，在消除後稍候，再以一次 SpawnMore 要求補足總數。SpawnMore 只會增加計數器，由單一協程逐步處理，因此運作期間的新要求會排隊等候，不會另開一輪。',
      ),
      result: bi(
        'A clear now makes one refill request, and Bomb holds no reference to the spawner. A floor added on 18 November also counts the live toppings after each batch and tops the cup up to 25.',
        '每次消除現在只提出一次補料要求，Bomb 亦毋須持有 Spawner 的參照。11 月 18 日另加入下限：每批補料後點算場上配料，不足 25 件便補足。',
      ),
    },
    {
      title: bi('From a state flag to small chain rules', '由狀態旗標改為細小的連線規則'),
      problem: bi(
        'On 13 November all matching sat inside one long method. The Dual Connect topping armed a flag so a later chain could accept a second type, and the blocker check repeated the same tag logic.',
        '11 月 13 日的版本把所有配對邏輯都放在一個長方法內。Dual Connect 配料會開啟旗標，讓下一條連線接受第二種配料，而阻擋檢查又重複同一套標籤邏輯。',
      ),
      decision: bi(
        'On 17 November the topping became a plain wildcard and the rules moved into small predicates. CanAddToppingToChain decides who may join, HasBlockingToppingBetween handles line of sight, and bombs and wildcards are recognised by component rather than by tag.',
        '11 月 17 日，該配料改為單純的萬用配料，規則亦拆成多個細小的判斷方法：CanAddToppingToChain 決定誰可加入連線，HasBlockingToppingBetween 處理視線阻擋，炸彈及萬用配料則按元件而非標籤識別。',
      ),
      result: bi(
        'The deferred two-type state is gone. Specials cannot start a chain, only a normal first topping sets the base type, a chain holding a wildcard refuses a bomb, and specials never block a link.',
        '延後生效的雙類型狀態已經移除。特殊配料不可作連線起點，只有普通配料能定下基本類型，含萬用配料的連線不接受炸彈，特殊配料亦不會阻擋連結。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('Line of sight as a puzzle rule', '以視線判定作為解謎規則'),
      path: 'Assets/Script/Logic.cs',
      language: 'csharp',
      url: 'https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment/blob/23bdf28e693e432ae890a787a0b97c7ecd30fc62/Assets/Script/Logic.cs#L278-L293',
      code: `        Vector2 direction = (end - start).normalized;
        float distance = Vector2.Distance(start, end);
        // Raycast between the two toppings to detect any others in the path
        RaycastHit2D[] raycastHits = Physics2D.RaycastAll(start, direction, distance, toppingLayerMask);
        foreach(var raycastHit in raycastHits)
        {
            if(raycastHit.collider == null) continue;
            GameObject raycastHitObject = raycastHit.collider.gameObject;
            // Ignore the start and end toppings themselves
            if(raycastHitObject == fromTopping || raycastHitObject == toTopping) continue;
            // Special toppings don't block the connection
            if(IsSpecialTopping(raycastHitObject)) continue;
            // Normal blocker check: if it doesn't match our chain type, it blocks
            if(!string.IsNullOrEmpty(storedToppingTag) && raycastHitObject.tag != storedToppingTag) return true;
        }
        return false;`,
      note: bi(
        'A physics query decides whether a link is legal: only a different flavour in the path blocks it, so the moving board changes which chains are possible.',
        '由物理查詢判斷連結是否成立：路徑上只有不同口味的配料才會阻擋，因此棋盤一動，可連的路線亦隨之改變。',
      ),
    },
    {
      title: bi('Handing a body to the animation', '把物理物體交給動畫'),
      path: 'Assets/Script/Topping.cs',
      language: 'csharp',
      url: 'https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment/blob/23bdf28e693e432ae890a787a0b97c7ecd30fc62/Assets/Script/Topping.cs#L169-L184',
      code: `        if(rigidBody != null)
        {
            // Stop physics simulation so the topping follows the ladle cleanly
            rigidBody.simulated = false;
            // Clear any velocity to avoid visual jitter
            rigidBody.linearVelocity = Vector2.zero;
            rigidBody.angularVelocity = 0f;
        }

        // Parent to ladle transform so topping moves with ladle animation
        if(Spawner.Instance != null)
        {
            transform.SetParent(Spawner.Instance.transform, worldPositionStays: true);
        }

        isStuck = true;`,
      note: bi(
        'Turning simulation off and reparenting is what lets a keyframed ladle carry a physics object without the two fighting.',
        '停用物理模擬並更換父物件，湯勺動畫才能帶動物理物體，兩者互不干擾。',
      ),
    },
  ],
};

export default caseFile;
