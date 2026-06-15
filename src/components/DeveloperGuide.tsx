import React, { useState } from "react";
import { 
  FileText, 
  Code, 
  Database, 
  BookOpen, 
  Layers, 
  GitPullRequest, 
  Terminal, 
  Cpu, 
  Lightbulb,
  CheckCircle,
  Copy,
  Check
} from "lucide-react";

export default function DeveloperGuide() {
  const [activeTab, setActiveTab] = useState<"structure" | "files" | "api">("structure");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const apiSchemaCode = `export interface AvatarFile {
  id: number;
  image: string; // Base64 or Image URL
}

export interface AvatarInfo {
  type: string; // "emoji" | "file" | "none"
  file: AvatarFile | null;
}

export interface UserNode {
  userId: string;               // شناسه منحصر‌به‌فرد کاربر (مثلاً هگز آدرس ولت)
  nickname: string;             // نام نمایشی یا مستعار کاربر
  avatar: AvatarInfo | null;    // اطلاعات تصویر آواتار
  parent_id: string | null;     // شناسه معرف (بالاسری)
  join_date: string;            // تاریخ عضویت کاربر به فرمت ISO-8601
  level_from_you: number;       // فاصله سطحی نسبت به کانون فعلی (0 و 1 و 2 و 3)
  rank: string;                 // رتبه کاربری (مانند Partner, Leader, Bronze, Gold)
  direct_referrals: number;     // تعداد معرفی‌شدگان مستقیم
  total_network_size: number;   // کل حجم عددی ساب‌نتورک (جامعه زیرمجموعه)
  total_team_volume: string;     // حجم کل سرمایه‌گذاری تیم به صورت اعشار و برحسب WEI
  personal_sales_volume: string; // حجم سرمایه‌گذاری کاربری مستقیم خود فرد
  has_children?: boolean;       // وجود فرزند در لایه‌های پایین‌تر اختیاری
  children: UserNode[];         // آرایه لایه‌بندی شده درخت زیرمجموعه ها (بست عمیق لایه‌ها)
}`;

  const jsonSample = `{
  "userId": "0x4FA9B3C2D7E51F...",
  "nickname": "Amir Crypto",
  "avatar": {
    "type": "emoji",
    "file": null
  },
  "parent_id": null,
  "join_date": "2026-01-10T14:30:00Z",
  "level_from_you": 0,
  "rank": "Diamond",
  "direct_referrals": 8,
  "total_network_size": 245,
  "total_team_volume": "1455000000000000000000",
  "personal_sales_volume": "25000000000000000000",
  "children": [
    {
      "userId": "0x3B99FF5A1C2E...",
      "nickname": "Nima Pro",
      "parent_id": "0x4FA9B3C2D7E51F...",
      "join_date": "2026-02-15T09:12:00Z",
      "level_from_you": 1,
      "rank": "Gold",
      "direct_referrals": 3,
      "total_network_size": 18,
      "total_team_volume": "98000000000000000000",
      "personal_sales_volume": "5000000000000000000",
      "children": []
    }
  ]
}`;

  return (
    <div className="w-full text-right p-5 bg-brand-card/98 backdrop-blur-xl border border-brand-primary/25 rounded-brand-global h-full flex flex-col font-sans select-text overflow-y-auto max-h-[85vh] scrollbar-thin">
      
      {/* Header and Title */}
      <div className="flex items-center justify-between border-b border-brand-primary/20 pb-4 mb-4">
        <div className="flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/25 px-3 py-1 rounded-brand-btn text-brand-secondary">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-black">SYSTEM DOCS</span>
        </div>
        <div className="text-right">
          <h2 className="text-white font-bold text-lg">راهنمای فنی پیاده‌سازی و توسعه</h2>
          <p className="text-brand-secondary text-xs font-mono mt-1">Concentric Sub-network Radial Map Specification</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-3 gap-2 mb-6 bg-brand-inner/80 p-1.5 rounded-brand-global border border-white/5">
        <button
          onClick={() => setActiveTab("api")}
          className={`py-2 rounded-brand-global text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === "api" ? "bg-brand-primary/15 text-brand-secondary border border-brand-primary/30" : "text-gray-400 hover:text-white"}`}
        >
          <Database size={13} />
          <span>ساختار دیتای API</span>
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`py-2 rounded-brand-global text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === "files" ? "bg-brand-primary/15 text-brand-secondary border border-brand-primary/30" : "text-gray-400 hover:text-white"}`}
        >
          <FileText size={13} />
          <span>شناسنامه فایل‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab("structure")}
          className={`py-2 rounded-brand-global text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === "structure" ? "bg-brand-primary/15 text-brand-secondary border border-brand-primary/30" : "text-gray-400 hover:text-white"}`}
        >
          <BookOpen size={13} />
          <span>مفاهیم پیاده‌سازی</span>
        </button>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 space-y-5">
        
        {/* TAB 1: HOW IT WORKS / CONVENTIONS */}
        {activeTab === "structure" && (
          <div className="space-y-4 animate-fadeIn text-sm text-gray-300">
            <div className="bg-brand-inner/40 border border-brand-primary/15 p-4 rounded-brand-global">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center justify-end gap-2 text-right">
                <span>نمودار مداری هم‌مرکز چطور کار می‌کند؟</span>
                <Layers className="text-brand-secondary w-4 h-4" />
              </h3>
              <p className="leading-relaxed text-xs text-justify">
                این کامپوننت برخلاف چارت‌های درختی سنتی عمودی یا افقی، کل ساختار شبکه چند لایه MLM / تیمی کارگزاران را در یک <strong className="text-brand-secondary">مجموعه ۴ حلقه‌ای هم‌مرکز (Concentric Rings)</strong> به نمایش می‌گذارد. حلقه مرکزی یا ریشه (سطح 0) هسته کانون شبکه است و تا لایه ۴ بازتاب‌دهنده عمق تیمی است.
              </p>
            </div>

            <div className="bg-brand-inner/40 border border-brand-primary/15 p-4 rounded-brand-global">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center justify-end gap-2 text-right">
                <span>الگوریتم زاویه‌دهی تناسبی (Proportional Weighting)</span>
                <Cpu className="text-brand-secondary w-4 h-4" />
              </h3>
              <p className="leading-relaxed text-xs text-justify">
                برای جلوگیری از تداخل فیزیکی یا تو‌هم‌رفتگی گره‌ها هنگام شلوغی شبکه، الگوریتم یک <strong className="text-brand-secondary">تخصیص سکتور زاویه‌ای تناسبی</strong> انجام می‌دهد. کل دایره (۳۶۰ درجه) به تناسب حجم کل زیرمجموعه فرزندان لایه اول تقسیم می‌شود. مثلاً اگر گره اول مجموع تیمش ۱۰۰ نفر باشد و گره دوم ۱۰ نفر، گره اول سهم سکتور بزرگتری از نما را به خود تخصیص می‌دهد تا فرزندان لایه‌های پایین‌ترش فضای متناسب برای فرود داشته باشند.
              </p>
              <ul className="list-disc leading-relaxed mt-2 pl-0 pr-4 space-y-1 text-right text-[11px] text-gray-400">
                <li><strong className="text-white">جداسازی گره‌ها بر روی یک مپ:</strong> با فیلتر فاصله سینوسی به صورت اتومات بازه قطری گره‌های همسایه بررسی و مقیاس آیکون‌ها کالیبره می‌شود.</li>
                <li><strong className="text-white">جلوگیری از اسکرول صفحه:</strong> ساختار اصلی چارت در داخل والپیپر کانواس ست شده است که تمام هندلینگ زوم و پن را روی خود کنترلر اعمال کرده و اسکرول بادی بیرونی برداشته می‌شود.</li>
              </ul>
            </div>

            <div className="bg-brand-inner/40 border border-brand-primary/15 p-4 rounded-brand-global flex items-start gap-3 justify-end text-right">
              <div className="flex-1 text-xs">
                <span className="text-brand-secondary font-bold block mb-1">تسهیل تعاملات برنامه‌نویسی</span>
                <span className="text-[11px] text-gray-400">
                  اگر فرانت شما پاسخ مناسب لود شبکه را برای ۴ سطح بگیرید، نیازی به واکشی دیتابیس با عمق زیاد در یک ریکوئست نیست. مدل پیاده‌سازی این چارت از الگوی <strong className="text-brand-secondary">Travel In/Out</strong> استفاده می‌کند؛ با دابل کلیک روی گره پیرامونی، آن گره لایه صفر شده و کامپوننت با آدرس ID آن گره ریکوئست جدید زده و ۲ تا ۳ سطح زیرشاخه‌های او را لود می‌کند و تاریخچه را در استک برای بازگشت (Back) نگه می‌دارد.
                </span>
              </div>
              <Lightbulb className="text-amber-400 w-5 h-5 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* TAB 2: CORRESPONDING CODE FILES */}
        {activeTab === "files" && (
          <div className="space-y-3 animate-fadeIn text-xs text-gray-300">
            <p className="text-gray-400 text-[11px] leading-relaxed mb-1 pr-1">
              ساختار لایه‌بندی درختی این پروپوزال شامل فایل‌های تعاملی زیر در پروژه اصلی می‌باشد. برنامه‌نویس مربوطه باید این چند پوشه را با همین الگو منتقل کند:
            </p>

            {/* File 1: types.ts */}
            <div className="bg-brand-inner/70 border border-white/5 p-3.5 rounded-brand-global">
              <div className="flex items-center justify-between font-mono mb-1.5">
                <span className="text-gray-500 text-[10px]">Data Definitions</span>
                <span className="text-white font-bold select-all text-xs">/src/types.ts</span>
              </div>
              <p className="leading-relaxed text-gray-400 text-[11px]">
                تعریف تایپ‌های سراسری. فیلد <code className="text-brand-secondary font-mono">UserNode</code> قلب دیتای دریافتی از REST API یا قراردادهای هوشمند بازی‌ها است.
              </p>
            </div>

            {/* File 2: NetworkGraph.tsx */}
            <div className="bg-brand-inner/70 border border-white/5 p-3.5 rounded-brand-global">
              <div className="flex items-center justify-between font-mono mb-1.5">
                <span className="text-brand-secondary text-[10px] uppercase font-bold tracking-wider">کامپوننت کلیدی</span>
                <span className="text-white font-bold select-all text-xs">/src/components/NetworkGraph.tsx</span>
              </div>
              <p className="leading-relaxed text-gray-400 text-[11px]">
                رندرسازی گراف و حلقه‌های فضایی روی بستر HTML5 Canvas. شامل الگوریتم‌های حرکت (Pan)، بزرگنمایی مستقل (Zoom Scroll)، ترسیم مسیرهای لیزری گره‌ها با خطوط گرادیان متحرک و فیکس لایه پاپ‌آپ هاور به همراه راهنمای تعامل فارسی.
              </p>
            </div>

            {/* File 3: UserDetailPanel.tsx */}
            <div className="bg-brand-inner/70 border border-white/5 p-3.5 rounded-brand-global">
              <div className="flex items-center justify-between font-mono mb-1.5">
                <span className="text-gray-500 text-[10px]">Analytical View</span>
                <span className="text-white font-bold select-all text-xs">/src/components/UserDetailPanel.tsx</span>
              </div>
              <p className="leading-relaxed text-gray-400 text-[11px]">
                پنل ثابت سمت راست صفحه. آمار دقیق تیمی، حجم دلاری و BNB معاملاتی ساب‌نتورک فعلی، لیست فرزندان مستقیم و فیلترهای نمایش تراکنش‌های اخیر را به شکل گرافیکی رندر می‌کند.
              </p>
            </div>

            {/* File 4: mockData.ts */}
            <div className="bg-brand-inner/70 border border-white/5 p-3.5 rounded-brand-global">
              <div className="flex items-center justify-between font-mono mb-1.5">
                <span className="text-gray-500 text-[10px]">Helper / Tree Extractor</span>
                <span className="text-white font-bold select-all text-xs">/src/mockData.ts</span>
              </div>
              <p className="leading-relaxed text-gray-400 text-[11px]">
                حاوی توابعی همچون جستجوی عمیق گره در بین لایه‌ها، بیرون کشیدن یک شاخه عمیق برای تبدیل آن به روت جدید لایه صفر، و توابع تولید دیتای رندوم جهت استرس تست لود چارت.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: API VALUE EXPECTED AND EXPECTING SCHEMA */}
        {activeTab === "api" && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <p className="text-gray-400 text-[11px] leading-relaxed pr-1 text-right">
              برای لود اتمی چارت، API سرور شما باید ساختاری عمیق با گره‌های لایه پایین به صورت تو در تو در یک لیست <code className="text-brand-secondary font-mono">children</code> تولید کند. در زیر ساختار دقیق اینترفیس TypeScript و نمونه دیتای خروجی JSON آورده شده است:
            </p>

            {/* TypeScript schema */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1 text-gray-400 font-mono text-[10px]">
                <button 
                  onClick={() => handleCopy(apiSchemaCode, "ts")}
                  className="hover:text-white flex items-center gap-1 bg-brand-card px-2 py-0.5 rounded border border-white/5 hover:border-brand-primary/30 text-[9px]"
                >
                  {copiedText === "ts" ? <Check size={10} className="text-brand-secondary" /> : <Copy size={10} />}
                  <span>{copiedText === "ts" ? "کپی شد" : "کپی ساختار"}</span>
                </button>
                <span>تعریف Interface ورودی (TypeScript)</span>
              </div>
              <div className="relative rounded-brand-global overflow-hidden border border-brand-primary/15 bg-brand-inner">
                <pre className="text-left font-mono text-[10px] leading-relaxed text-[#a5d6ff] p-4 overflow-x-auto scrollbar-thin overflow-y-auto max-h-[180px]">
                  {apiSchemaCode}
                </pre>
              </div>
            </div>

            {/* JSON Output illustration */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1 text-gray-400 font-mono text-[10px]">
                <button 
                  onClick={() => handleCopy(jsonSample, "json")}
                  className="hover:text-white flex items-center gap-1 bg-brand-card px-2 py-0.5 rounded border border-white/5 hover:border-brand-primary/30 text-[9px]"
                >
                  {copiedText === "json" ? <Check size={10} className="text-brand-secondary" /> : <Copy size={10} />}
                  <span>{copiedText === "json" ? "کپی شد" : "کپی نمونه خروجی"}</span>
                </button>
                <span>نمونه دیتای دریافتی واقعی (JSON Payload)</span>
              </div>
              <div className="relative rounded-brand-global overflow-hidden border border-brand-primary/15 bg-brand-inner">
                <pre className="text-left font-mono text-[10px] leading-relaxed text-emerald-400 p-4 overflow-x-auto scrollbar-thin overflow-y-auto max-h-[185px]">
                  {jsonSample}
                </pre>
              </div>
            </div>

            <div className="bg-brand-primary/5 border border-brand-primary/25 rounded-brand-global p-3 text-right">
              <div className="flex items-center justify-end gap-1.5 text-brand-secondary font-bold mb-1">
                <span>توصیه فنی واکشی داده</span>
                <CheckCircle size={12} />
              </div>
              <p className="text-gray-400 text-[10.5px] leading-relaxed">
                فرانت‌اند کل درگاه را بر اساس <strong className="text-white">children</strong> لایه‌بندی بالا رندر خواهد کرد. برای لود سبک، نیازی نیست کل پایگاه داده شبکه MLM را یکجا بفرستید. در هر درخواست عمیق (مثال دابل کلیک)، فقط اطلاعات گره‌ی کلیک شده به همراه فرزندان مستقیمش و گره‌های پس‌فرزند تا حداکثر ۴ لایه عمیق واکشی و فشرده شود.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
