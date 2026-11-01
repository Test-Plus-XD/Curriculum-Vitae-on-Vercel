import { bi } from '../i18n-text';
import type { CaseFile } from '../casefile';

// Credits PRs #1 to #4 and the owner's own commits in keithku321's public repository. PR #4 is still open and ran through a remote
// session on a teammate's PC, so its commits carry that machine's git identity. Figures are pinned to main at 831a783e and PR #4 at 4b715b1a.
const caseFile: CaseFile = {
  role: bi(
    'Supported a four-person HKMU final-year team by building the shared training, evaluation and results code, producing its first real-data baseline, and then running the baselines of all four plans through a remote session on a teammate’s faster PC. I worked with Claude Code: 23 of the 27 commits credited to me name Claude as author or co-author.',
    '協助一支四人香港都會大學畢業專題團隊，建立共用的訓練、評估及結果紀錄程式碼，完成團隊首個真實數據基準模型（水底），其後透過遙距連線，在隊友效能較佳的電腦上完成全部四個方案的基準訓練。開發時以 Claude Code 作為 AI 編程助手，歸於本人的 27 次提交中，有 23 次列 Claude 為作者或共同作者。',
  ),
  facts: [
    { value: 0.584, decimals: 3, label: bi('mAP50, underwater baseline at 20 epochs', 'mAP50，20 個 epoch 的水底基準模型') },
    { value: 0.635, decimals: 3, label: bi('mAP50 on DAWN adverse weather, seed 0', 'DAWN 惡劣天氣 mAP50，種子 0') },
    { value: 0.853, decimals: 3, label: bi('S-measure on COD10K camouflage, seed 0', 'COD10K 偽裝目標 S-measure，種子 0') },
    { value: 0.291, decimals: 3, label: bi('mAP50 on VisDrone small objects, seed 0', 'VisDrone 細小物件 mAP50，種子 0') },
    { value: 14674, label: bi('Brackish images re-split by video clip', '張 Brackish 圖像按影片片段重新切分') },
    { value: 84, label: bi('test functions written on main', '個已撰寫的測試函式（main 分支）') },
  ],
  contributions: [
    bi(
      'Shared framework (PR #1, with the run plots added in PR #2), written with Claude Code: a dataset manifest, one train, evaluate and log loop, a results CSV and run plots. Python on main, starter files included, totals 5,404 lines with 84 test functions, counted from the source rather than from a test run.',
      '共用框架（PR #1，訓練圖表於 PR #2 加入），借助 Claude Code 編寫：資料集清單、統一的訓練、評估及記錄流程、結果 CSV 及訓練圖表。main 分支上的 Python 程式碼（包括起始檔案）合共 5,404 行，另有 84 個測試函式；此數字由原始碼點算得出，並非測試運行結果。',
    ),
    bi(
      'Drafted code for all four plans (PR #1): per-plan training scripts, custom attention and fusion layers, and a four-tab Gradio demo app. The real-data runs that followed are baselines: the custom layers have not been trained on real data, and the demo app was only checked to start and serve its four tabs.',
      '為全部四個方案撰寫初稿（PR #1）：各方案訓練腳本、自訂注意力及融合層，以及設有四個分頁的 Gradio 示範程式。其後以真實數據進行的訓練均為基準模型：自訂層尚未以真實數據訓練，示範程式亦只檢查過能否啟動並顯示四個分頁。',
    ),
    bi(
      'Underwater baseline (PR #2): YOLO26n on Brackish, 20 epochs, one seed, validation mAP50 0.584 and mAP50-95 0.345. Crab AP was 0.000 in the same run. The best checkpoint was picked on validation, so both figures are slightly optimistic.',
      '水底基準模型（PR #2）：YOLO26n 於 Brackish 訓練 20 個 epoch，單一隨機種子，驗證 mAP50 為 0.584、mAP50-95 為 0.345。同一次訓練中，蟹的 AP 為 0.000。最佳檢查點由驗證集選出，因此兩項數字略為樂觀。',
    ),
    bi(
      'Phase 1 baselines of all four plans (PR #4, still open), through a remote session on a teammate’s RTX 5060 Ti PC: a scheduled runner trained five models overnight in about 3 h 40 min. Seed 0 only: Brackish mAP50 0.597 at 50 epochs, DAWN fold 0 student 0.635, VisDrone 0.291 with AP small 0.083, and S-measure 0.853 on COD10K and 0.854 on CAMO. The 50-epoch underwater run is newer but not clearly better: mAP50-95 went from 0.345 to 0.344 and precision from 0.754 to 0.580.',
      '全部四個方案的第一階段基準訓練（PR #4，尚未合併），透過遙距連線於隊友的 RTX 5060 Ti 電腦上進行：由排程腳本於一夜之間訓練五個模型，歷時約 3 小時 40 分鐘。僅使用種子 0：Brackish 於 50 個 epoch 的 mAP50 為 0.597，DAWN 第 0 折學生模型為 0.635，VisDrone 為 0.291（AP small 0.083），COD10K 及 CAMO 的 S-measure 分別為 0.853 及 0.854。50 個 epoch 的水底訓練雖然較新，卻未見明顯進步：mAP50-95 由 0.345 變為 0.344，精確率由 0.754 變為 0.580。',
    ),
    bi(
      'Dataset corrections (PR #1), with Claude Code: re-split Brackish by video clip and renumbered DAWN’s classes by name, checked against the PASCAL VOC names of its 1,027 images.',
      '資料集修正（PR #1），借助 Claude Code 完成：將 Brackish 按影片片段重新切分，並按類別名稱重新編號 DAWN，再與其 1,027 張圖像的 PASCAL VOC 名稱核對。',
    ),
    bi(
      'Project governance: plans, phase gates, stewards for shared files and the team’s workflow documents.',
      '項目管治：撰寫計劃、階段關卡、共用檔案負責人安排及團隊工作流程文件。',
    ),
    bi(
      'A training driver for all four plans and a guard against reusing a run of another epoch count (PR #3). That pull request was closed without merging, so none of this work reached main.',
      '編寫全部四個方案的訓練驅動腳本，並加入防止重用不同 epoch 數訓練結果的檢查（PR #3）。該 PR 未經合併便已關閉，因此這部分工作沒有進入 main 分支。',
    ),
  ],
  flow: [
    {
      name: bi('Dataset manifest', '資料集清單'),
      note: bi(
        'One JSON file records each dataset’s source, licence notes and download instructions.',
        '以一個 JSON 檔案記錄各資料集的來源、授權備註及下載步驟。',
      ),
      link: bi('tells the scripts what to fetch', '告知腳本要取得甚麼'),
    },
    {
      name: bi('Preparation', '資料準備'),
      note: bi(
        'Scripts prepare and check Brackish and DAWN, then write fixed split lists, with Brackish split by video clip.',
        '由腳本準備及檢查 Brackish 與 DAWN，再寫出固定的切分清單，其中 Brackish 按影片片段切分。',
      ),
      link: bi('fixed train and validation lists', '固定的訓練及驗證清單'),
    },
    {
      name: bi('Model definition', '模型定義'),
      note: bi(
        'Ultralytics stays pinned at 8.4.175; generated YAML files and a layer map add custom layers without editing the library.',
        'Ultralytics 固定於 8.4.175；以生成的 YAML 檔案及層對應表加入自訂層，毋須修改函式庫。',
      ),
      link: bi('model source and trainer class', '模型來源及訓練器類別'),
    },
    {
      name: bi('Shared training loop', '共用訓練流程'),
      note: bi(
        'Plans A, B and C train through one loop at 640 px with nms=False; Plan D keeps its own plain PyTorch loop.',
        '方案 A、B、C 經同一流程以 640 像素及 nms=False 訓練；方案 D 則使用獨立的純 PyTorch 流程。',
      ),
      link: bi('evaluates the trained weights', '評估訓練所得權重'),
    },
    {
      name: bi('Results log', '結果紀錄'),
      note: bi(
        'Each run adds one CSV row with its metrics, head, GPU, commit, library versions and timestamp.',
        '每次訓練新增一行 CSV，記錄指標、偵測頭、GPU、提交編號、函式庫版本及時間。',
      ),
      link: bi('saves a figure of the run', '儲存該次訓練的圖表'),
    },
    {
      name: bi('Plots', '圖表'),
      note: bi(
        'A Matplotlib figure of each run shows losses, mAP and per-class scores; selected plots are committed beside the results.',
        '每次訓練生成一幅 Matplotlib 圖表，顯示損失、mAP 及各類別分數；選定的圖表會連同結果一併提交。',
      ),
    },
  ],
  dispatches: [
    {
      title: bi('The split that leaked whole clips', '洩漏整段影片的資料切分'),
      problem: bi(
        'The Roboflow copy of Brackish spread all 89 source clips across train, validation and test. Frames from one clip sat on both sides of the split, which flatters validation scores.',
        'Roboflow 版本的 Brackish 把全部 89 段來源影片同時分到訓練、驗證及測試集。同一片段的畫面出現在切分兩邊，會令驗證分數虛高。',
      ),
      decision: bi(
        'Keep every clip whole in one split. Try 500 clip orders and pick the one whose validation and test sets best match the class mix, without using model results.',
        '每段影片只放入一個切分。嘗試 500 種片段次序，選出驗證集及測試集最貼近整體類別比例的一種，過程不參考任何模型結果。',
      ),
      result: bi(
        'The 14,674 images became 11,612 train, 1,575 validation and 1,487 test, with no clip in two splits. Frames from different clips of the same fixed camera can still look alike.',
        '14,674 張圖像分為訓練 11,612 張、驗證 1,575 張及測試 1,487 張，沒有片段橫跨兩個切分。不過同一固定鏡頭的不同片段，畫面仍可能相似。',
      ),
    },
    {
      title: bi('Measuring accuracy on the head that gets timed', '在計時所用的偵測頭上量度準確度'),
      problem: bi(
        'The plans took YOLO26 inference to be NMS-free by default. Reading Ultralytics 8.4.175 showed that validation uses the one-to-many head with external NMS unless told otherwise, while the speed protocol times the one-to-one head.',
        '計劃原本以為 YOLO26 推論預設不需 NMS。細讀 Ultralytics 8.4.175 後發現，除非另行指定，驗證會使用一對多偵測頭及外部 NMS，而速度測試計時的卻是一對一偵測頭。',
      ),
      decision: bi(
        'Pass nms=False through the shared train, validation and predict code, and write the head used into the results rows.',
        '在共用的訓練、驗證及預測程式碼中傳入 nms=False，並把所用偵測頭寫入結果列。',
      ),
      result: bi(
        'Both rows on main record head=one2one(nms=False). Speed has not been measured, so only the accuracy half of the pairing exists so far.',
        'main 分支上的兩行結果均記錄 head=one2one(nms=False)。速度尚未量度，因此目前只有準確度這一半的數據。',
      ),
    },
    {
      title: bi('The class the model never found', '模型始終找不到的類別'),
      problem: bi(
        'In the 20-epoch run crab scored AP 0.000, and the normalised confusion matrix sends true crabs to background at 1.00. Scarcity does not explain it: crab has the most training boxes, 9,706.',
        '在 20 個 epoch 的訓練中，蟹的 AP 為 0.000，正規化混淆矩陣亦顯示真實的蟹全部（1.00）被判為背景。原因並非數據不足：蟹的訓練標註框最多，達 9,706 個。',
      ),
      decision: bi(
        'Report the failure in PR #2 beside the headline figure, and advise inspecting crab images and labels before comparing any attention variants.',
        '在 PR #2 中把這項失敗與主要數字並列報告，並建議先檢查蟹的圖像及標註，然後才比較各注意力變體。',
      ),
      result: bi(
        'The cause has not been established. The mAP50 of 0.584 is an average over six classes, so it also hides shrimp at 0.080.',
        '原因至今尚未查明。0.584 的 mAP50 是六個類別的平均值，因此同時掩蓋了蝦只有 0.080 的情況。',
      ),
    },
  ],
  exhibits: [
    {
      src: '/images/projects/yolo-object-detection/per-class-map.webp',
      width: 1592,
      height: 532,
      alt: bi(
        'Bar chart of mAP50 and mAP50-95 per class: crab 0.000 and 0.000, fish 0.878 and 0.552, jellyfish 0.812 and 0.512, shrimp 0.080 and 0.056, small_fish 0.740 and 0.336, starfish 0.995 and 0.615.',
        '各類別 mAP50 及 mAP50-95 的棒形圖：crab（蟹）0.000 及 0.000、fish（魚）0.878 及 0.552、jellyfish（水母）0.812 及 0.512、shrimp（蝦）0.080 及 0.056、small_fish（小魚）0.740 及 0.336、starfish（海星）0.995 及 0.615。',
      ),
      caption: bi(
        'Validation scores per class from the 20-epoch run with one seed. Crab is at 0.000 and shrimp at 0.080, while the headline mAP50 of 0.584 averages all six.',
        '20 個 epoch、單一隨機種子訓練所得的各類別驗證分數。蟹為 0.000，蝦為 0.080，而 0.584 的主要 mAP50 是六個類別的平均值。',
      ),
    },
    {
      src: '/images/projects/yolo-object-detection/confusion-matrix.webp',
      width: 1600,
      height: 1437,
      alt: bi(
        'Normalised confusion matrix for six classes plus background. The crab column reads 1.00 at background; the correct-class cells read starfish 1.00, small_fish 0.90, fish 0.86, jellyfish 0.53 and shrimp 0.08.',
        '六個類別加背景的正規化混淆矩陣。crab（蟹）一欄在 background（背景）處為 1.00；各類別判斷正確的比例為 starfish（海星）1.00、small_fish（小魚）0.90、fish（魚）0.86、jellyfish（水母）0.53、shrimp（蝦）0.08。',
      ),
      caption: bi(
        'Normalised confusion matrix from the same run. True crabs go to background at 1.00, and 0.54 of true shrimp are lost the same way.',
        '同一次訓練的正規化混淆矩陣。真實的蟹全部（1.00）被判為背景，真實的蝦亦有 0.54 同樣遺漏。',
      ),
    },
    {
      src: '/images/projects/yolo-object-detection/validation-map.webp',
      width: 796,
      height: 534,
      alt: bi(
        'Line chart of validation mAP50 and mAP50-95 over 20 epochs. mAP50 stays between about 0.56 and 0.59 from about epoch 7, and mAP50-95 is marked best at 0.345 on epoch 16.',
        '20 個 epoch 的驗證 mAP50 及 mAP50-95 折線圖。mAP50 約由第 7 個 epoch 起維持在 0.56 至 0.59 之間，mAP50-95 的最佳點標示於第 16 個 epoch，數值為 0.345。',
      ),
      caption: bi(
        'Validation mAP across the run. Epoch 16 is the best checkpoint at mAP50-95 0.345, and more epochs alone did little after about epoch 7.',
        '整次訓練的驗證 mAP。第 16 個 epoch 為最佳檢查點，mAP50-95 為 0.345；約第 7 個 epoch 之後，單靠增加 epoch 已沒有多大幫助。',
      ),
    },
  ],
  excerpts: [
    {
      title: bi('Keeping every clip whole', '保持每段影片完整'),
      path: 'underwater/prepareBrackish.py',
      language: 'python',
      url: 'https://github.com/keithku321/object-detection/blob/831a783e233eebeb1bbf821acdfce2b382d40cc7/underwater/prepareBrackish.py#L125-L134',
      code: `def assignClipsToSplits(imageCountByClip, seed):
    clipNames = sorted(imageCountByClip)
    random.Random(seed).shuffle(clipNames)
    totalImages = sum(imageCountByClip.values())
    assignment, filledImages = {}, {"val": 0, "test": 0}
    for clipName in clipNames:
        openSplit = next((splitName for splitName in ("val", "test") if filledImages[splitName] < holdOutFraction * totalImages), None)
        assignment[clipName] = openSplit or "train"
        if openSplit: filledImages[openSplit] += imageCountByClip[clipName]
    return assignment`,
      note: bi(
        'Validation and test fill up from a shuffled clip order and everything left is training data, so a clip is only ever assigned as a whole.',
        '驗證集及測試集按打亂後的片段次序填滿，餘下的全部作為訓練數據，因此每段影片只會整段分配。',
      ),
    },
    {
      title: bi('One head for accuracy and speed', '準確度與速度共用一個偵測頭'),
      path: 'common/training.py',
      language: 'python',
      url: 'https://github.com/keithku321/object-detection/blob/831a783e233eebeb1bbf821acdfce2b382d40cc7/common/training.py#L18-L25',
      code: `# Which YOLO26 head produces the reported accuracy. In Ultralytics 8.4.175, val, predict and the validation inside training use the
# one-to-many head with external NMS unless nms=False is passed (the default nms=None means external NMS). The speed protocol times
# the NMS-free one-to-one head, so accuracy is measured on that same head: every train, val and predict call passes these arguments.
# Models without a one-to-one head (YOLO11, YOLOv8 reference rows) ignore the setting and keep using NMS.
# This is a protocol decision for the whole team: change it only by agreement and record it in plans/decisions.md.
endToEndArguments = {"nms": False}
# Text added to the notes of every results row so the head used for a number is never ambiguous
endToEndNote = "head=one2one(nms=False)"`,
      note: bi(
        'The setting lives in one place, and its note is written into the results rows, so a logged number says which head produced it.',
        '這項設定集中在一處，其備註會寫入結果列，因此紀錄的數字會標明由哪個偵測頭得出。',
      ),
    },
  ],
};

export default caseFile;
