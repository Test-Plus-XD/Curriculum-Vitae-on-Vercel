import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Kaguya lives in keithku321's private repository, so this file holds prose and counts only: no excerpts, exhibits, paths or links.
// Some of the owner's work ran through a remote session on keithku321's PC, so git authorship understates it and no share is quoted.
const caseFile: CaseFile = {
  role: bi(
    'Contributor to keithku321’s private project, working partly through a remote session on keithku321’s PC: in October 2026 I added the avatar’s motion layer, picture reading in Discord chats and an install path for newer Python versions. I worked with Claude as an AI coding assistant.',
    '本人為 keithku321 私人項目的貢獻者，部分工作透過遙距連線於 keithku321 的電腦上進行：於 2026 年 10 月加入虛擬形象的動作層、Discord 聊天圖片理解，以及較新 Python 版本的安裝路徑。開發時以 Claude 作為 AI 編程助手。',
  ),
  facts: [
    { value: 646, label: bi('motion engine lines, all from my commits', '行動作引擎程式碼，全部出自本人提交') },
    { value: 30, suffix: ' Hz', label: bi('single motion loop', '單一動作迴圈') },
    { value: 16, label: bi('feelings held as mood points', '種情感以情緒座標表示') },
    { value: 55, label: bi('test functions for the motion and install work', '個動作及安裝相關的測試函式') },
    { value: 35, label: bi('test functions for picture reading', '個圖片理解測試函式') },
  ],
  contributions: [
    bi(
      'A motion engine for VTube Studio, 646 of 646 lines mine: seeded blink, gaze and sway, and a face that eases towards any of 16 feelings, each held as a valence–arousal–dominance point, with a 0.45 s time constant, all sent in one 30 Hz loop.',
      '為 VTube Studio 編寫動作引擎，646 行全部由本人提交：以種子控制的眨眼、視線及擺動，以及把 16 種情感各自表示為情緒維度（愉悅度、激發度、支配度）座標、並以 0.45 秒時間常數平滑過渡的面部表情，全部經單一 30 Hz 迴圈送出。',
    ),
    bi(
      'Speech gestures planned from a clip’s loudness: small accents on loud onsets, at most one per 0.6 s, plus up to three larger gestures by clip length, tried with a made-up voice clip.',
      '按語音片段的音量規劃語音手勢：在響亮的起音處加入細微動作，每 0.6 秒最多一次，另按片段長度加入最多三個較大的手勢；測試時使用模擬語音片段。',
    ),
    bi(
      'A text-driven mouth, so lines nobody speaks aloud still move the mouth and head, using a repeatable mouth built from the text; verified live in the terminal chat, while the Discord side is tested with fakes only.',
      '以文字驅動口部，令無人讀出的台詞同樣帶動口部及頭部；口型由文字生成，每次結果相同，並已於終端機聊天中實機驗證，Discord 一方則只以模擬物件測試。',
    ),
    bi(
      'Mouse glances: every 25 to 70 s the eyes go to the cursor for 3.5 to 7.5 s and give way to speech gestures, checked on a 14-second clip by reading the engine’s values back.',
      '視線跟隨滑鼠：每隔 25 至 70 秒，雙眼望向游標 3.5 至 7.5 秒，並會讓路給語音手勢；已讀回引擎數值，於一段 14 秒片段上核對。',
    ),
    bi(
      'Picture reading in Discord chats through a local Ollama vision model, with captions treated as untrusted data so nothing from a picture reaches memory or the cloud. It adds 35 test functions, run against fakes; the real vision model on real pictures is still unchecked.',
      '透過本地 Ollama 視覺模型理解 Discord 聊天中的圖片，並將圖片描述視為不可信數據，確保圖片內容不會進入記憶或雲端。此功能新增 35 個測試函式，以模擬物件運行；真實視覺模型配合真實圖片尚未驗證。',
    ),
    bi(
      'An install path for Python 3.13 and 3.14 that leaves the 3.11 and 3.12 setup unchanged; a full run on the newer versions is unverified.',
      '為 Python 3.13 及 3.14 建立安裝路徑，3.11 及 3.12 的設定維持不變；較新版本尚未完成完整運行驗證。',
    ),
    bi(
      '55 test functions for the motion and install work remain in the project, counted from the source rather than from a test run.',
      '項目中現存 55 個動作及安裝相關的測試函式；此數字由原始碼點算得出，並非測試運行結果。',
    ),
  ],
  flow: [
    {
      name: bi('The companion’s reply', '伴侶的回覆'),
      note: bi('keithku321’s system decides what to say, which feeling to show and whether the line is spoken.', '由 keithku321 的系統決定回覆內容、展示的情感，以及台詞是否讀出。'),
      link: bi('a spoken clip, or the reply text', '語音片段，或回覆文字'),
    },
    {
      name: bi('Mouth envelope', '口型包絡'),
      note: bi('A spoken clip uses keithku321’s voice-following mouth; a line nobody speaks uses my text-built mouth on the same path.', '語音片段使用 keithku321 的語音跟隨口型；無人讀出的台詞則以本人的文字口型走同一路徑。'),
      link: bi('loudness over time', '隨時間變化的音量'),
    },
    {
      name: bi('Speech planner', '語音規劃器'),
      note: bi('Places small accents on loud onsets and up to three larger gestures by clip length.', '在響亮的起音處安排細微動作，並按片段長度安排最多三個較大的手勢。'),
      link: bi('planned gestures', '已規劃的手勢'),
    },
    {
      name: bi('Motion layers', '動作層'),
      note: bi('Seeded blink, gaze, sway and breath, the eased mood and the mouse glances each produce small offsets.', '以種子控制的眨眼、視線、擺動及呼吸，加上平滑過渡的情緒及視線跟隨滑鼠，各自產生細微偏移。'),
      link: bi('offsets from every layer', '各層的偏移值'),
    },
    {
      name: bi('Mixer and loop', '混合器與迴圈'),
      note: bi('One mixer adds the layers together, and one loop is the only writer, so mouth and motion cannot overwrite each other.', '由一個混合器疊加各層，並由單一迴圈負責寫入，因此口部與動作不會互相覆蓋。'),
      link: bi('one request per tick, 30 times a second', '每秒 30 次，每次一個請求'),
    },
    {
      name: bi('VTube Studio', 'VTube Studio'),
      note: bi('Receives the values and moves the Live2D character on screen.', '接收數值，帶動畫面上的 Live2D 角色。'),
    },
  ],
  dispatches: [
    {
      title: bi('A character that stood still between lines', '台詞之間一動不動的角色'),
      problem: bi(
        'Hotkeys could only switch faces and props on and off, and the avatar model has no blink, gaze or sway of its own. Between lines the character stood motionless.',
        '快捷鍵只能開關表情及道具，而虛擬形象模型本身沒有眨眼、視線或擺動，角色在台詞之間只能一動不動。',
      ),
      decision: bi(
        'I added independent seeded controllers whose outputs one mixer adds together, held each feeling as a point the face eases towards, and had one 30 Hz loop write everything, mouth included. The repository records these ideas as drawn from a public Apache-2.0 emotion SDK and re-implemented with no code copied.',
        '本人加入多個獨立、以種子控制的控制器，由一個混合器疊加輸出；每種情感表示為一個座標，面部朝該座標平滑過渡；再由單一 30 Hz 迴圈寫入所有數值，包括口部。程式庫記錄這些構思源自一個公開的 Apache-2.0 情感 SDK，並經重新實現，沒有複製程式碼。',
      ),
      result: bi(
        'Read back from the live model, the head turned between -4.5 and 2.2 units and blinks closed the eye; an angry face took the mouth form to -0.54 and a happy one to +0.82. These are measured values, not a judgement of how the motion looks.',
        '從運行中的模型讀回數值：頭部轉動範圍為 -4.5 至 2.2 單位，眨眼時眼睛確實閉合；憤怒表情把口型值帶到 -0.54，開心表情則帶到 +0.82。這些是量度數值，並非對動作觀感的評價。',
      ),
    },
    {
      title: bi('Lines nobody speaks aloud', '無人讀出的台詞'),
      problem: bi(
        'The mouth only followed real audio, so text replies left the character silent and still.',
        '口部只會跟隨真實音訊，因此文字回覆令角色既無聲亦不動。',
      ),
      decision: bi(
        'With no sound to measure, I built a mouth from the text: one opening per kana or Chinese character, about one per three letters of a Latin word, and rests at punctuation, seeded from the text so a line always gives the same mouth. It enters the same path as real audio, so head gestures are planned as normal, and the Discord side first checks whether a reply is really spoken.',
        '既然沒有聲音可量度，本人便由文字生成口型：每個假名或漢字張口一次，拉丁字母約每三個一次，遇標點則停頓；並以文字本身作為種子，令同一句台詞的口型每次相同。口型走與真實音訊相同的路徑，頭部手勢照常規劃；Discord 一方則會先檢查回覆是否真的讀出。',
      ),
      result: bi(
        'Verified live in the terminal chat: the mouth peaked at 0.82 for about 5.6 s with a 2-degree nod, then closed. The Discord side was written against fakes and has not been seen live.',
        '已於終端機聊天中實機驗證：口部開合峰值為 0.82，持續約 5.6 秒，並伴隨 2 度點頭，其後閉合。Discord 一方以模擬物件編寫，尚未實機觀察。',
      ),
    },
    {
      title: bi('A glance that yields to a gesture', '讓路給手勢的一瞥'),
      problem: bi(
        'The first mouse glance fired only when the mouse had moved and the character was silent, so it never happened during speech or with a still mouse.',
        '最初的滑鼠視線只會在滑鼠移動過且角色沉默時觸發，因此說話期間或滑鼠靜止時都不會出現。',
      ),
      decision: bi(
        'Fourteen minutes after the first version I dropped both conditions and ran it on a timer of 25 to 70 s. A glance moves the head, so only a planned speech gesture can now block one or fade it out, within 0.25 s.',
        '首個版本完成 14 分鐘後，本人取消這兩項條件，改為每 25 至 70 秒定時觸發。由於視線會帶動頭部，現在只有已規劃的語音手勢才能阻止視線，或在 0.25 秒內令其淡出。',
      ),
      result: bi(
        'On a 14 s clip with a still mouse, read back from the engine, glances fell at 0 to 2.3 s, 5 to 6.8 s and 9.3 to 11.8 s, and gestures ran at 2.3 to 3.1, 7.0 to 8.4 and 11.7 to 13.0 s. No glance ran during a gesture, apart from a 0.1 s overlap as the last one faded out.',
        '在一段 14 秒、滑鼠靜止的片段上讀回引擎數值：視線出現於 0 至 2.3 秒、5 至 6.8 秒及 9.3 至 11.8 秒，手勢則位於 2.3 至 3.1 秒、7.0 至 8.4 秒及 11.7 至 13.0 秒。視線沒有在任何手勢期間出現，僅最後一次在淡出時與手勢重疊 0.1 秒。',
      ),
    },
  ],
};

export default caseFile;
