# 旅游手帐 — Personal Travel Journal

纯前端个人旅游手帐应用。以杂志/画报风格呈现旅行记录，支持富文本日记编辑、照片管理、心情天气标记、地图足迹可视化、消费记账、标签分类与数据备份。

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) | ^3.5 |
| 语言 | TypeScript | ~6.0 |
| 构建 | Vite | ^8.0 |
| 样式 | Tailwind CSS | ^4.3 |
| 路由 | Vue Router (Hash Mode) | ^5.1 |
| 状态管理 | Pinia | ^3.0 |
| 数据持久化 | Dexie.js (IndexedDB) | ^4.4 |
| 富文本编辑器 | Tiptap (ProseMirror) | ^3.24 |
| 地图 | Leaflet + @vue-leaflet/vue-leaflet | ^1.9 / ^0.10 |
| 日期处理 | date-fns | ^4.4 |
| ID 生成 | uuid | ^14.0 |

## 功能总览

### 行程管理
- 创建/编辑/删除行程，支持封面图、旅伴、预算、标签、描述
- 首页杂志网格布局：CSS Grid 不规则卡片，每第 5 张跨两行形成错落节奏
- 实时搜索（标题/目的地/标签）+ 标签筛选
- 行程统计横幅：累计旅程数、旅行天数、目的地城市数、标签数

### 日记编辑
- **Tiptap 富文本编辑器**：粗体、斜体、下划线、H1-H3 标题、有序/无序列表、引用、分隔线、文本对齐、撤销/重做
- **图片插入**：工具栏内置图片 URL 弹窗，支持从 PicGo 粘贴链接插入行内图片
- **12 种心情 emoji 选择器**（开心/愉快/平静/疲惫/难过/兴奋/酷/幸福/生气/焦虑/不适/震惊）
- **10 种天气图标选择器**（晴天/多云/阴天/下雨/雷雨/下雪/雾/彩虹/寒冷/大风）
- **Leaflet 小地图**：点击标记位置 + 手动填写地名，无需 API Key

### 消费记账
- 六类支出：餐饮 🍜 / 交通 🚇 / 住宿 🏨 / 景点 🎫 / 购物 🛍️ / 其他 💰
- 多币种支持（CNY/USD/EUR/JPY/KRW/THB/GBP/AUD/TWD/HKD）
- 实时合计汇总

### 图片管理
- 外部图床 URL 模式：使用 PicGo 上传至 Cloudflare R2，粘贴链接即可
- 照片按日记条目关联，支持标题
- 加载失败自动降级为占位背景
- 行程画廊：CSS Columns 多列瀑布流 + 全屏灯箱（键盘左右切换 / Esc 关闭）

### 地图足迹
- Leaflet + OpenStreetMap 瓦片（免费，无 API Key）
- 自定义 `divIcon` 圆形编号标记（显示 Day N）
- 按时间顺序的虚线路线连线
- `fitBounds` 自适应显示全部足迹
- 点击标记弹出详情（天数/标题/心情/地名）

### 统计面板
- 记录天数 vs 总天数、照片数量、打卡地点数、总字数
- 最常心情展示
- 消费按类别汇总，含合计

### 发布展示
- **发布模式**：将导出的 JSON 数据放入 `public/data/journal.json`，构建后部署到公网，访客自动加载为只读展示
- 顶部导航栏显示「Published」标签，隐藏设置入口
- 隐藏所有创建 / 编辑 / 删除按钮和 FAB，富文本编辑器降级为只读
- 图片输入框隐藏，照片区域仅展示已关联图片

### 数据备份
- **导出**：一键下载 `travel-journal-backup-YYYY-MM-DD.json`
- **导入**：选择 JSON 文件，校验结构后事务性写入，替换全部数据
- **删除日记**：时间线卡片悬停出现删除按钮（确认弹窗）；编辑页顶部提供删除入口
- **存储统计**：行程数 / 日记数 / 照片数
- **清除全部数据**：含二次确认弹窗

## 项目结构

```
src/
├── main.ts                          # 应用入口，挂载 Vue + Pinia + Router + Leaflet CSS
├── App.vue                          # 根组件，布局壳 + 页面过渡 + Toast + 发布数据自动加载
│
├── types/
│   └── index.ts                     # 全部 TypeScript 接口与常量定义
│
├── router/
│   └── index.ts                     # Hash 路由配置（6 条路由）
│
├── db/
│   └── index.ts                     # Dexie.js 数据库类（Schema / Hooks / 级联删除 / 导入导出）
│
├── stores/
│   ├── tripStore.ts                 # 行程 CRUD + 搜索过滤
│   ├── dayEntryStore.ts             # 日记 CRUD + 按行程分组
│   ├── photoStore.ts                # 照片 URL CRUD
│   ├── settingsStore.ts             # 设置 + 存储统计 + 导入导出
│   └── uiStore.ts                   # UI 状态：Tab / 弹窗 / Toast / isPublished
│
├── utils/
│   ├── date.ts                      # date-fns 封装（格式化、日期计算）
│   ├── id.ts                        # UUID 生成
│   ├── currency.ts                  # 货币符号与格式化
│   └── plain.ts                     # 剥离 Vue 响应式 Proxy，转为纯 JS 对象
│
├── assets/
│   └── styles/
│       └── main.css                 # Tailwind CSS @theme 品牌色配置 + 全局样式
│
├── pages/
│   ├── HomePage.vue                 # 首页：横幅 + 搜索筛选 + 杂志卡片网格 + FAB
│   ├── TripDetailPage.vue           # 行程详情：封面 + 四 Tab + FAB
│   ├── DayEditorPage.vue            # 日记编辑器：双栏布局 + 保存/删除 + 发布模式只读
│   ├── SettingsPage.vue             # 设置：存储统计 + 备份导入导出 + 清除数据
│   └── NotFoundPage.vue             # 404 页面
│
└── components/
    ├── common/                      # 公共组件（6 个）
    │   ├── AppHeader.vue            #   顶部导航栏 + Published 标签
    │   ├── AppFooter.vue            #   底部页脚
    │   ├── ConfirmDialog.vue        #   确认弹窗（支持危险操作样式）
    │   ├── EmptyState.vue           #   空状态插画 + CTA
    │   ├── LoadingSpinner.vue       #   加载动画
    │   └── ToastNotification.vue    #   Toast 消息队列
    │
    ├── home/                        # 首页组件（5 个）
    │   ├── HeroBanner.vue           #   统计横幅
    │   ├── SearchFilterBar.vue      #   搜索框 + 标签筛选
    │   ├── TripGrid.vue             #   CSS Grid 杂志布局容器
    │   ├── TripCard.vue             #   单张行程卡片（渐变封面 + 信息叠加）
    │   └── NewTripDialog.vue        #   创建行程表单弹窗
    │
    ├── trip/                        # 行程详情组件（5 个）
    │   ├── TripCoverHeader.vue      #   全幅封面图 + 行程元信息
    │   ├── TabNavigation.vue        #   四 Tab 导航（日记/画廊/地图/统计）
    │   ├── TimelineView.vue         #   垂直时间线布局
    │   ├── DayEntryCard.vue         #   单条日记卡片（点击进入 / 悬停删除）
    │   └── TripStatsPanel.vue       #   统计面板
    │
    ├── editor/                      # 日记编辑器组件（8 个）
    │   ├── RichTextEditor.vue       #   Tiptap 富文本编辑器（发布模式自动只读）
    │   ├── EditorToolbar.vue        #   编辑工具栏（19 个按钮 + 图片 URL 弹窗）
    │   ├── DayEditorSidebar.vue     #   右侧边栏容器
    │   ├── MoodPicker.vue           #   心情 emoji 选择器
    │   ├── WeatherPicker.vue        #   天气图标选择器
    │   ├── LocationMiniMap.vue      #   Leaflet 小地图选点
    │   ├── ExpenseLineItems.vue     #   消费明细编辑列表
    │   └── PhotoUrlInput.vue        #   图片 URL 输入 + 预览条
    │
    ├── gallery/                     # 画廊组件（2 个）
    │   ├── GalleryGrid.vue          #   CSS Columns 瀑布流
    │   └── PhotoLightbox.vue        #   全屏灯箱（键盘导航）
    │
    ├── map/                         # 地图组件（1 个）
    │   └── TripMap.vue              #   Leaflet 全屏地图 + 标记 + 路线
    │
    └── settings/                    # 设置组件（3 个）
        ├── StorageStats.vue         #   存储统计卡片
        ├── ExportImport.vue         #   导出 / 导入按钮
        └── ClearDataButton.vue      #   清除全部数据（危险区域）
```

## 数据模型

### Trip（行程）

```typescript
interface Trip {
  id: string
  title: string
  coverImage?: string          // PicGo 图床 URL
  destination: string
  startDate: string            // YYYY-MM-DD
  endDate: string              // YYYY-MM-DD
  companion?: string
  budget?: number
  currency: Currency           // CNY | USD | EUR | JPY | KRW | THB | GBP | AUD | TWD | HKD
  tags: string[]
  description?: string
  createdAt: string            // ISO 8601
  updatedAt: string            // ISO 8601
}
```

### DayEntry（日记条目）

```typescript
interface DayEntry {
  id: string
  tripId: string
  dayNumber: number            // 1-based
  date: string                 // YYYY-MM-DD
  title?: string
  content: string              // Tiptap HTML
  mood?: Mood                  // 12 种 emoji
  weather?: Weather            // 10 种天气 emoji
  location?: { lat: number; lng: number; name: string }
  expenses?: ExpenseItem[]
  createdAt: string
  updatedAt: string
}
```

### Photo（照片）

```typescript
interface Photo {
  id: string
  entryId: string
  tripId: string
  url: string                  // PicGo 图床 URL（仅存链接，不存 base64）
  caption?: string
  takenAt?: string
  createdAt: string
}
```

### ExpenseItem（消费明细）

```typescript
interface ExpenseItem {
  id: string
  category: 'food' | 'transport' | 'accommodation' | 'attractions' | 'shopping' | 'other'
  amount: number
  currency: Currency
  note: string
}
```

### 辅助类型

```typescript
type Mood = '😄' | '😊' | '😐' | '😴' | '😢' | '🤩' | '😎' | '🥰' | '😤' | '😰' | '🤒' | '😱'
type Weather = '☀️' | '⛅' | '☁️' | '🌧️' | '⛈️' | '🌨️' | '🌫️' | '🌈' | '❄️' | '💨'
type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'KRW' | 'THB' | 'GBP' | 'AUD' | 'TWD' | 'HKD'
```

## 数据库设计

基于 Dexie.js 封装的 IndexedDB，数据库名 `TravelJournalDB`，当前版本 Schema v1。

| 表名 | 主键 | 索引字段 | 说明 |
|------|------|----------|------|
| `trips` | `id` | `title, destination, startDate, endDate, createdAt` | 行程数据 |
| `dayEntries` | `id` | `tripId, dayNumber, date, [tripId+dayNumber]` | 日记数据，复合索引支持按行程+日期查询 |
| `photos` | `id` | `entryId, tripId, takenAt` | 照片 URL，按条目和行程关联 |
| `settings` | `key` | — | 键值对存储应用设置 |

**自动化机制：**

- `creating` hook：自动填入 `createdAt` / `updatedAt`（ISO 8601 时间戳）
- `deleteTripCascade(tripId)`：事务性级联删除行程 → 日记 → 照片
- `deleteEntryCascade(entryId)`：事务性级联删除日记 → 照片
- `exportAll()`：事务性导出全部数据为 JSON 字符串
- `importAll(json)`：事务性校验并导入 JSON，替换全部现有数据

**Vue 响应式兼容：**

Store 层的 `createTrip` / `createEntry` / `updateEntry` 方法内部通过 `toPlain()` 将数据转为纯 JS 对象后再写入 IndexedDB。因为 IndexedDB 的结构化克隆算法无法序列化 Vue 的响应式 Proxy，直接存储 Reactive/Ref 包装后的数组或对象会导致 `DataCloneError`。

## 路由表

| 路径 | 路由名 | 页面组件 | 说明 |
|------|--------|----------|------|
| `/` | `home` | HomePage | 首页，杂志网格布局 |
| `/trip/:id` | `trip` | TripDetailPage | 行程详情 + 四 Tab |
| `/trip/:id/day/new` | `day-new` | DayEditorPage | 新建日记 |
| `/trip/:id/day/:dayId` | `day-edit` | DayEditorPage | 编辑已有日记 |
| `/settings` | `settings` | SettingsPage | 设置与数据管理 |
| `/:pathMatch(.*)*` | `not-found` | NotFoundPage | 404 页面 |

使用 `createWebHashHistory` 哈希路由，兼容静态文件部署（GitHub Pages / Netlify / Vercel），无需服务端路由配置。

## Pinia Store 设计

| Store | 文件 | 核心职责 |
|-------|------|----------|
| `useTripStore` | `tripStore.ts` | 行程 CRUD；`searchQuery` + `activeTagFilter` 响应式过滤；`filteredTrips` / `allTags` / `tripCount` 计算属性 |
| `useDayEntryStore` | `dayEntryStore.ts` | 日记 CRUD；按 `tripId` 分组缓存于 `entriesByTrip`；自动计算 `dayNumber` |
| `usePhotoStore` | `photoStore.ts` | 照片 URL CRUD；按 `entryId` / `tripId` 查询 |
| `useSettingsStore` | `settingsStore.ts` | 设置读写；存储统计 `getStorageStats()`；全量导出/导入；清除数据 |
| `useUIStore` | `uiStore.ts` | `activeTripTab`；`isNewTripDialogOpen`；Toast 消息队列；`isPublished` 发布模式标记 |

## 图片工作流

本项目采用 **外部图床链接** 模式，不存储图片文件本身。

```
PicGo 客户端 → 上传图片至 Cloudflare R2 → 获取 URL → 粘贴至应用
```

**使用流程：**

1. 在 PicGo 中配置 Cloudflare R2 作为图床
2. 拖拽或剪贴板上传图片，PicGo 自动将 URL 复制到剪贴板
3. 在日记编辑器中粘贴 URL：
   - **工具栏图片弹窗**：插入 Tiptap 行内图片
   - **PhotoUrlInput 组件**：添加关联日记的照片（支持标题）

**Cloudflare R2 兼容：**

所有 `<img>` 标签统一添加了 `referrerpolicy="no-referrer"`，兼容开启了防盗链（热链保护）的 R2 Bucket。浏览器不再向图床发送 `Referer` 头，无需修改 R2 的 WAF 规则或 CORS 策略即可正常加载图片。支持 WebP、JPEG、PNG、GIF、AVIF、SVG 等所有浏览器原生图片格式。

**设计优势：**
- IndexedDB 仅存储 URL 字符串，存储压力接近于零
- 图片托管在 Cloudflare CDN，加载速度快
- JSON 导出体积小（不含 base64 编码的图片数据）
- 不影响应用构建体积
- 不依赖服务端 CORS 配置，本地开发和任意域名部署均可正常显示

## 品牌视觉

| 属性 | 值 |
|------|------|
| **背景色** | 奶油白 `#faf7f2` |
| **主文字** | 墨色 `#2d2d2d` |
| **强调色** | 杂志粉 `#e85d75` |
| **点缀色** | 金色 `#c9a84c` / 薄荷绿 `#7ecba1` / 天蓝 `#6eb5d6` |
| **深色** | 海军蓝 `#1a2744` |
| **标题字体** | Playfair Display / Noto Serif SC (衬线) |
| **正文字体** | Inter / Noto Sans SC (无衬线) |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone git@github.com:JMbaozi/travel-journal.git
cd travel-journal

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 开发服务器

启动后访问 `http://localhost:5173`。所有数据存储在浏览器 IndexedDB 中，无需后端服务。

### 推荐搭配

- **PicGo**：跨平台图床上传工具，配置 Cloudflare R2 后将图片 URL 粘贴到应用中
- **Chrome / Edge DevTools**：Application > IndexedDB > TravelJournalDB 可直接查看和调试数据

## 构建输出

| 文件 | 大小 (未压缩) | 大小 (Gzip) | 说明 |
|------|---------------|-------------|------|
| `index.html` | 0.87 kB | 0.48 kB | 入口 HTML |
| `assets/index-*.css` | 54.2 kB | 13.7 kB | 主样式（Tailwind + 品牌定制） |
| `assets/index-*.js` | 211.8 kB | 76.1 kB | 主 JS 包（Vue + Pinia + Router + 公共组件） |
| `assets/DayEditorPage-*.js` | 388.6 kB | 121.2 kB | 编辑器页面（Tiptap + Leaflet） |
| `assets/photoStore-*.js` | 150.5 kB | 44.1 kB | Photo store chunk |
| `assets/TripDetailPage-*.js` | 16.2 kB | 6.1 kB | 行程详情页 |
| `assets/HomePage-*.js` | 12.7 kB | 4.2 kB | 首页 |
| `assets/SettingsPage-*.js` | 4.6 kB | 2.0 kB | 设置页 |

全部页面按路由懒加载，首屏仅加载主包。

## 发布部署

本项目支持两种模式：

- **本地模式**（默认）：你自己创建和编辑手帐内容，数据存浏览器 IndexedDB
- **发布模式**：将本地创建好的内容打包进网站，部署到公网，访客只读浏览

### 发布流程

**1. 本地创建内容**

```bash
npm run dev
```

打开 `http://localhost:5173`，创建行程、添加日记、上传照片，完成所有手帐内容。

**2. 导出数据**

进入「设置」→ 点击「导出备份 (JSON)」→ 得到 `travel-journal-backup-YYYY-MM-DD.json`

**3. 放置数据文件**

将导出的 JSON 文件复制到 `public/data/` 目录，重命名为 `journal.json`：

```
public/data/journal.json
```

**4. 构建**

```bash
npm run build
```

数据文件会被打包进 `dist/`，线上访客首次访问时自动加载为只读展示。

**5. 部署**

将 `dist/` 目录上传到任意静态托管服务。

### 发布模式效果

- 访客打开网站即看到你写好的手帐内容
- 顶部导航栏显示「Published」标签
- 隐藏所有创建 / 编辑 / 删除按钮
- 隐藏 FAB 浮动按钮
- 日记页变为只读浏览模式
- 设置页入口隐藏

### 更新内容

本地修改内容 → 重新导出 → 覆盖 `public/data/journal.json` → 重新 `npm run build` → 重新部署。

### 兼容的部署平台

| 平台 | 方式 |
|------|------|
| **阿里云 OSS** | 上传 `dist/` 至 Bucket，开启静态网站托管 |
| **GitHub Pages** | 推送到 `gh-pages` 分支或配置 Actions |
| **Netlify / Vercel** | 关联仓库，自动构建部署 |
| **Cloudflare Pages** | `npm run build` 输出目录设为 `dist/` |
| **Nginx / ECS** | `scp dist/*` 至服务器，配置 `root` 指向目录 |

Hash 路由模式无需服务端配置，所有平台开箱即用。

## 路线图

- [x] 行程管理（CRUD + 搜索 + 标签筛选）
- [x] 杂志网格布局首页
- [x] 富文本日记编辑器（Tiptap）
- [x] 心情 / 天气标记
- [x] Leaflet 地图足迹（标记 + 路线）
- [x] 消费记账（六类 + 多币种 + 汇总）
- [x] 照片 URL 管理（PicGo + 图床）
- [x] 画廊瀑布流 + 灯箱
- [x] 统计面板
- [x] JSON 导入导出备份
- [x] 发布展示模式（数据预置 + 公网只读访问）
- [ ] PWA 离线支持
- [ ] 暗色模式
- [ ] 日记模板功能
- [ ] 时间轴打印导出 PDF
- [ ] 多语言支持（i18n）

## 许可证

MIT License — 详见 [LICENSE](./LICENSE) 文件。
