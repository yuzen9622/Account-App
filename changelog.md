# Changelog

## [1.4.0] - 2025-02-13
### 🔄 變更
- 更改ui顏色設計
- 將fontawsome的chavron icon更換成MUI的chavron icon
### 🛠️ 修正
- 性能優化

## [1.3.9] - 2025-02-13
### 🔄 變更
- 更改ui顏色設計
### 🛠️ 修正
- 性能優化

## [1.3.8] - 2025-02-12
### 🔄 變更
- 更改ui顏色設計
### 🛠️ 修正
- 非數值處理和請求失敗時message
- token 過期處理

## [1.3.7] - 2025-02-11
### 🔄 變更
- 更新帳戶以及類別彈跳框以及自動扣款介面
- 將initalAmount改成initialAmount


## [1.3.6] - 2025-02-09
### ✨ 新增
- components 新增FormatNumber、AccountRecord、Record、TotalHeader、DateRecord、Add
### 🛠️ 修正
- 匯出檔案依日期排序
### 🔄 變更
- Animation number 的動畫更改成number-flow
- NavSett 的button樣式
## [1.3.5] - 2025-02-08
### 🛠️ 修正
- 將重複組件封裝成component->AnimatedTag、DateSelect
- Datetime日期選取範圍問題
- Add組件日期

## [1.3.4] - 2025-02-08
### ✨ 新增
- 記帳資料匯出功能
### 🛠️ 修正
- 一些小問題
- 日期到日期選擇器範圍問題
## [1.3.3] - 2025-02-07
### ✨ 新增
- 新增token獲取錯誤的顯示
### 🛠️ 修正
修復轉帳紀錄更新成支出或收入紀錄時的toAccount問題

## [1.3.2] - 2025-02-06
### ✨ 新增
- 將account金額新增動畫
### 🛠️ 修正
- splash background 顏色錯誤

## [1.3.1] - 2025-02-05
### 🔄 變更
- 減少導覽步驟

## [1.3.0] - 2025-02-05
### ✨ 新增
- 新增使用者自選主題功能及深色模式
- 新增 `ThemeContext` 用於主題管理
- 新增導覽模式

### 🔄 變更
- 統一顏色變數於 `:root`
- 調整 Navbar 顏色

## [1.2.0] - 2025-02-03
### ✨ 新增
- 新增 Splash Page
- `Snackbar` 新增關閉按鈕

### 🔄 變更
- Icon 更換為 MUI Icon
- 「描述」改為「備註」

### 🛠️ 修正
- 修正圖片未載入時 Splash Page 提早結束的問題

## [1.1.0] - 2025-02-02
### ✨ 新增
- 新增長條圖於圖表功能

### 🔄 變更
- 調整日曆組件
- 調整 Chart 最大寬度（max-width）
- 日曆的今天日期顯示為「今天」
- 初始餘額輸入模式修改為 `inputMode="numeric"`

### 🛠️ 修正
- 修復載入時當日紀錄顯示異常
- 修正「今天」顯示錯誤問題

## [1.0.0] - 2025-02-01
### ✨ 新增
- 記帳 App 初始版本發佈

### 🔄 變更
- 調整登入及註冊 UI
- 調整字體大小
- 更換日曆組件（FullCalendar -> React-Calendar）

### 🛠️ 修正
- 將 `setMessage` 和 `message` 移至 `UserContext`
