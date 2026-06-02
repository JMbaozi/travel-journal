# Travel Journal (旅游手帐) — 开发方案

## 项目概述

基于 Vue 3 + TypeScript 构建的纯前端个人旅游手帐应用。杂志/画报风格视觉，支持富文本日记编辑、图片管理、心情/天气标记、地图足迹、消费记账、数据备份等功能。数据通过 IndexedDB 持久化，图片使用 PicGo + Cloudflare 图床 URL 方案。

## 技术栈

| 类别 | 选择 | 原因 |
|------|------|------|
| 构建 | Vite + Vue 3 + TypeScript | 现代化前端工具链 |
| 样式 | Tailwind CSS v4 | 原子化 CSS，快速构建杂志风格 |
| 路由 | Vue Router 4 (hash mode) | 纯前端路由，兼容 GitHub Pages 等静态部署 |
| 状态管理 | Pinia | Vue 3 官方推荐的状态管理 |
| 数据存储 | Dexie.js (IndexedDB) | 结构化数据存储，支持索引查询和事务 |
| 富文本 | Tiptap (ProseMirror) | 轻量、可扩展、Vue 3 原生支持 |
| 地图 | Leaflet + @vue-leaflet/vue-leaflet | 开源免费，无需 API Key |
| 工具库 | date-fns, uuid | 日期处理、唯一 ID 生成 |

## 数据模型

### Trip（行程）
```typescript
interface Trip {
  id: string;
  title: string;
  coverImage?: string;       // 封面图片 URL（PicGo 图床链接）
  destination: string;
  startDate: string;         // ISO 8601 日期 (YYYY-MM-DD)
  endDate: string;
  companion?: string;
  budget?: number;
  currency: Currency;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### DayEntry（日记条目）
```typescript
interface DayEntry {
  id: string;
  tripId: string;
  dayNumber: number;          // 1-based，第几天
  date: string;               // YYYY-MM-DD
  title?: string;
  content: string;            // Tiptap 输出的 HTML
  mood?: Mood;                // emoji 心情
  weather?: Weather;          // emoji 天气
  location?: Location;        // 地图位置
  expenses?: ExpenseItem[];   // 消费明细
  createdAt: string;
  updatedAt: string;
}
```

### Photo（照片）
```typescript
interface Photo {
  id: string;
  entryId: string;
  tripId: string;
  url: string;               // PicGo 图床 URL
  caption?: string;
  takenAt?: string;
  createdAt: string;
}
```

### ExpenseItem（消费明细）
```typescript
interface ExpenseItem {
  id: string;
  category: 'food' | 'transport' | 'accommodation' | 'attractions' | 'shopping' | 'other';
  amount: number;
  currency: Currency;
  note: string;
}
```

### 辅助类型
```typescript
type Mood = '😄' | '😊' | '😐' | '😴' | '😢' | '🤩' | '😎' | '🥰' | '😤' | '😰' | '🤒' | '😱';
type Weather = '☀️' | '⛅' | '☁️' | '🌧️' | '⛈️' | '🌨️' | '🌫️' | '🌈' | '❄️' | '💨';
type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'KRW' | 'THB' | 'GBP' | 'AUD' | 'TWD' | 'HKD';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface AppSettings {
  theme: 'light' | 'dark';
  defaultCurrency: Currency;
  lastExportDate?: string;
}

interface BackupData {
  version: number;
  exportedAt: string;
  trips: Trip[];
  dayEntries: DayEntry[];
  photos: Photo[];
  settings: AppSettings | null;
}
```

## 路由设计

| 路径 | 页面组件 | 说明 |
|------|----------|------|
| `/` | HomePage | 杂志网格布局展示全部行程卡片 |
| `/trip/:id` | TripDetailPage | 行程详情，4 个 Tab（日记/画廊/地图/统计） |
| `/trip/:id/day/new` | DayEditorPage | 新建日记入口 |
| `/trip/:id/day/:dayId` | DayEditorPage | 编辑已有日记 |
| `/settings` | SettingsPage | 数据管理与备份 |

## 组件架构

```
App.vue
├── AppHeader.vue                    — 顶部导航栏
├── AppFooter.vue                    — 底部页脚
└── <RouterView>                     — 页面过渡动画包裹
    ├── HomePage.vue                 — 首页
    │   ├── HeroBanner.vue           — 统计数据横幅
    │   ├── SearchFilterBar.vue      — 搜索框 + 标签筛选
    │   ├── TripGrid.vue             — CSS Grid 杂志布局
    │   │   └── TripCard.vue × N     — 单张行程卡片
    │   └── NewTripDialog.vue        — 新建行程弹窗
    ├── TripDetailPage.vue           — 行程详情
    │   ├── TripCoverHeader.vue      — 全幅封面图 + 行程信息
    │   ├── TabNavigation.vue        — 日记 | 画廊 | 地图 | 统计
    │   ├── TimelineView.vue         — 时间线视图
    │   │   └── DayEntryCard.vue × N — 单条日记卡片
    │   ├── GalleryGrid.vue          — 照片瀑布流
    │   │   └── PhotoLightbox.vue    — 全屏灯箱
    │   ├── TripMap.vue              — Leaflet 地图
    │   └── TripStatsPanel.vue       — 行程统计面板
    ├── DayEditorPage.vue            — 日记编辑器（双栏布局）
    │   ├── RichTextEditor.vue       — Tiptap 富文本编辑器
    │   ├── EditorToolbar.vue        — 编辑工具栏
    │   ├── DayEditorSidebar.vue     — 右侧边栏容器
    │   │   ├── MoodPicker.vue       — 心情选择器（12 种 emoji）
    │   │   ├── WeatherPicker.vue    — 天气选择器
    │   │   ├── LocationMiniMap.vue  — 点位地图
    │   │   └── ExpenseLineItems.vue — 消费明细编辑
    │   └── PhotoUrlInput.vue        — 图片 URL 输入 + 预览
    └── SettingsPage.vue             — 设置页
        ├── StorageStats.vue         — 存储统计
        ├── ExportImport.vue         — 导入导出
        └── ClearDataButton.vue      — 清除全部数据

公共组件: ConfirmDialog, EmptyState, LoadingSpinner, ToastNotification, SlideTransition
```

## IndexedDB Schema

```typescript
// Dexie.js v1 schema
db.version(1).stores({
  trips:       'id, title, destination, startDate, endDate, createdAt',
  dayEntries:  'id, tripId, dayNumber, date, [tripId+dayNumber]',
  photos:      'id, entryId, tripId, takenAt',
  settings:    'key',
})
```

- `[tripId+dayNumber]` 复合索引用于按行程和时间排序查询日记
- 自动 hook 设置 `createdAt` / `updatedAt`
- 级联删除：删除行程时同步删除其所有日记和照片
- 事务性导入导出：`exportAll()` / `importAll()`

## Pinia Stores

| Store | 职责 |
|-------|------|
| `tripStore` | 行程 CRUD，搜索过滤（searchQuery + tagFilter），计算 filteredTrips / allTags |
| `dayEntryStore` | 日记 CRUD，按 tripId 分组加载，自动计算 dayNumber |
| `photoStore` | 照片 URL CRUD，按 entryId / tripId 查询 |
| `settingsStore` | 应用设置读写，存储统计，全量导出/导入，清除数据 |
| `uiStore` | UI 状态：当前 Tab、弹窗开关、Toast 队列 |

## 关键设计细节

### 杂志布局
- CSS Grid `repeat(auto-fill, minmax(280px, 1fr))` + `grid-auto-rows: 320px`
- 每第 5 张卡片 `grid-row: span 2` 形成错落节奏
- 封面渐变遮罩：`linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)`
- 品牌色系：杂志粉 `#e85d75`、金色 `#c9a84c`、海军蓝 `#1a2744`、奶油白 `#faf7f2`
- 字体：Playfair Display + Noto Serif SC（标题） / Inter + Noto Sans SC（正文）

### 图片工作流（PicGo + Cloudflare）
1. 用户在 PicGo 中将图片上传至 Cloudflare R2
2. PicGo 返回 URL 并自动复制到剪贴板
3. 在应用内粘贴 URL → 即时预览 → 添加标题 → 保存
4. 支持批量粘贴多个 URL，逐个预览确认
5. 图片加载失败显示占位图

### Tiptap 富文本编辑器
- 扩展：StarterKit, Image, Placeholder, Underline, TextAlign
- editor 实例通过 provide/inject 传递给 Toolbar
- 插入图片时弹出对话框输入 URL（配合 PicGo 使用）
- v-model 模式同步 HTML 内容

### Leaflet 地图
- 自定义 `L.divIcon` 圆形编号标记（显示 dayNumber）
- Polyline 按时间顺序连接各日记点位
- `fitBounds` 自适应显示全部标记
- TripDetailPage 全屏地图 + DayEditorPage 小地图选点

### 数据导入导出
- 导出：`JSON.stringify` → `Blob` → `<a download>` 触发下载
- 导入：`<input type="file">` → `FileReader` → 校验结构 → 事务写入
- 文件名：`travel-journal-backup-YYYY-MM-DD.json`

## 实现步骤

### Phase 0: 项目脚手架
- Vite 创建 Vue + TypeScript 项目
- 安装所有依赖
- 配置 Vite、TypeScript 路径别名、Tailwind CSS
- 创建完整目录结构
- 定义所有 TypeScript 类型
- 编写工具函数（date, id, currency）
- 设置 Vue Router 和 Pinia
- 创建 stub 页面占位

### Phase 1: 数据库层
- 实现 Dexie 数据库类
- 定义表结构和索引
- 实现自动时间戳 hook
- 实现级联删除方法
- 实现 exportAll / importAll

### Phase 2: Pinia Stores
- tripStore：行程 CRUD + 搜索过滤
- dayEntryStore：日记 CRUD + 按 tripId 分组
- photoStore：照片 URL CRUD
- settingsStore：设置 + 存储统计 + 导入导出
- uiStore：UI 状态管理

### Phase 3: 公共组件
- AppHeader, AppFooter
- ConfirmDialog, EmptyState, LoadingSpinner
- ToastNotification, SlideTransition

### Phase 4: 首页
- HeroBanner, SearchFilterBar, TripGrid, TripCard
- NewTripDialog（表单创建行程）

### Phase 5: 行程详情页
- TripCoverHeader（封面 + 视差效果）
- TabNavigation, TimelineView, DayEntryCard
- GalleryGrid, PhotoLightbox
- TripStatsPanel

### Phase 6: 日记编辑器
- RichTextEditor（Tiptap 封装）
- EditorToolbar
- DayEditorSidebar（MoodPicker, WeatherPicker, LocationMiniMap, ExpenseLineItems）
- PhotoUrlInput

### Phase 7: 地图视图
- TripMap（Leaflet 全屏地图 + 标记 + 路线连线）

### Phase 8: 设置页
- StorageStats, ExportImport, ClearDataButton

### Phase 9: 润色
- 响应式适配（移动端 / 平板 / 桌面）
- 页面过渡动画
- 滚动触发动画（IntersectionObserver）
- 视差滚动效果
- 打印样式
- 空状态插图

## 验证清单

- [ ] `npm run dev` 开发服务器正常启动
- [ ] 创建行程 → 行程卡片出现在首页网格
- [ ] 搜索和标签筛选正常工作
- [ ] 新建日记 → 富文本编辑 + 图片 URL 粘贴 + 心情/天气选择 + 地图选点 + 消费录入
- [ ] 日记保存后出现在时间线中
- [ ] 画廊 Tab 展示所有照片，点击进入灯箱
- [ ] 地图 Tab 显示全部标记和路线
- [ ] 统计 Tab 数据正确
- [ ] 导出 JSON → 导入恢复数据完整
- [ ] 删除行程级联删除日记和照片
- [ ] 三档响应式断点（320px / 768px / 1280px+）布局正常
- [ ] 无封面图显示渐变色占位
- [ ] 图片加载失败显示占位图
