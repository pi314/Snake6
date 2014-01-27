20140127
========

-   把初始化的步驟再細分成數個函式

-   製作移動尾巴的函式, 邊界開放

-   為蛇增加 dir, length, color 屬性

-   地圖資料改用 json object 儲存 ::
    
    {
        type: head/body/body_jump/tail/portal/cube/empty/ground/wall,
        color: green/yellow,
        row: 1/0/-1,
        col: 1/0/-1,
        data: (number),
    }

-   把 set_map_raw_data 更名為 set_map_data

-   製作移動頭的函式, 邊界開放

20140126
========

-   把 _game.js 切成 _game_snake.js 和 _game_map.js

-   把兩蛇的資料各自做成 object

-   把蛇的初始位置設定好, 並畫在地圖上,
    但最外層的 $(function) 沒有 document.ready 的效果, 原因未知

-   規畫 state transition

    ::

        .  +------------------------------+
           |       call back2menu()       |
           v                              |
        +------+ call enter_game()  +-----+------+
        | MENU |------------------->| GAME_PAUSE |
        +------+                    +--+---------+
           ^                           |      ^
           |                           |      | press space
           |               press space |      |
           |                           v      |
           |  call back2menu()      +---------+--+
           +------------------------|  GAME_ING  |
                                    +------------+

20131124
==========
-   [idea] 兩條蛇有獨立的按鍵 queue

-   [idea] 地圖資料

    -   資料種類

        -   head 上下左右
        -   body 上下左右
        -   portal
        -   cube
        -   empty

    -   資料格式

        -   四個欄位 (最後一個是 optional)

            -   Type 方塊種類

                -   Snake   S, s

                    -   若 Subtype 為 Head, 則 Type 用大寫 S 記錄
                    -   其餘為小寫 s

                -   Portal  P
                -   Cube    C
                -   Empty   .
                -   Wall    W

            -   Color 顏色

                -   (Yellow, Green, White, Black) = (Y, G, W, B)
                -   [idea] 若此方塊為蛇的尾巴, 則改為小寫

                    -   (Yellow, Green, White, Black) = (y, g, w, b)

            -   Direction 方向

                -   (上, 下, 左, 右) = (K, J, H, L)
                -   跳躍為 P + Number
                    Number 為 "蟲洞" (後述) 的 ID

        -   空的欄位或是不需要的資料用 "." 表示

        -   以下用表格舉例

            +--------+------------+--------+-----------+-------+
            |  Type  | Subtype    | Color  | Direction | Data  |
            +--------+------------+--------+-----------+-------+
            | Snake  | Head       | Yellow | Left      | SYL   |
            |        +------------+--------+-----------+-------+
            |        | Body       | Yellow | Left      | sYL   |
            |        +------------+--------+-----------+-------+
            |        | Body(Jump) | Yellow | (None)    | sYP10 |
            |        +------------+--------+-----------+-------+
            |        | Tail       | Yellow | Left      | syL   |
            +--------+------------+--------+-----------+-------+
            | Portal | (None)     | (None) | (None)    | P..   |
            +--------+------------+--------+-----------+-------+
            | Cube   | (None)     | (None) | (None)    | C..   |
            +--------+------------+--------+-----------+-------+
            | Empty  | (None)     | (None) | (None)    | ...   |
            +--------+------------+--------+-----------+-------+
            | Wall   | (None)     | (None) | (None)    | W..   |
            +--------+------------+--------+-----------+-------+

-   [idea] 用一個 array 來記錄 "蟲洞"

    -   格式 ::

            var wormhole = [
                (x, y),
                (x, y),
                ...
            ];

    -   可能需要建立相關的函式來 free 和 allocate 空間連結點
        如 free(id) 和 alloc(id)

    -   free 的時機

        -   portal 消失
            在 portal 消失時, 檢查四周的 wormhole, 取得各個 wormhole id
        -   tail 穿越 portal 時

-   [idea] 先縮 tail, 再移動 head

    -   長度 == 1 時死亡

20131103
==========

-   把 info_field 裡面 hard-coded HTML 從 js 移到 html 中

-   小更改 html id 命名方式, 使用 #id.button 來代表 button

-   做好主選單按鈕事件

20131030
==========

-   放上 github, 做好 README.md

-   加上 .gitignore

-   加上遊戲模式提示, 介面暫定完成
    先開始製作經典模式

-   製作介面讓使用者可以選擇控制來源 [PLAYER, AI, NONE]
    控制來源用一個陣列記錄
    有可能讓兩隻 AI 競爭

-   想起 KeyManager 的 scroll 有問題, 已修正並加入 namespace 機制

20131023
==========

-   製作蛇蛇資訊框

20131021
==========

-   決定主選單就是選擇模式

-   製作好模式選擇介面

-   製作好場地, 寬高為 550 x 550
    左方訊息區寬高為 200 x 550

-   製作蛇蛇資訊框

20131020
==========

-   開始製作主選單

-   仿製 Snake 5 的主選單
    預計 UI 都會和 Snake 5 很類似, 這次的目標是把 AI porting 進去
    且重製出 portal

-   最多兩人對戰

-   主選單的選項

    -   選擇模式
    -   ?

-   遊戲模式

    -   普通模式

        -   點選左邊的蛇依次切換為 User, AI, Disable

    -   驚喜模式

        -   普通模式 + portal

    -   競技場

        -   沒有星星

    -   Tron

        -   模仿 Tron 的遊戲方式
