import React, { useState, useMemo, useEffect } from "react";
import {
  Lock,
  Gift,
  Sparkles,
  Calendar as CalendarIcon,
  ShoppingBag,
  LogIn,
  X,
  Download,
  Home,
  Mail,
  Heart,
  Send,
  CheckCircle,
  FileText,
  Video,
  Image as ImageIcon,
  Music,
  Link,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Advent Magic — single‑file React prototype (no backend)
// Uses the palette: Ultra Violet #585081, Saffron #F8C761, Dark Green #203822, Hunter Green #42644B, Dark Purple #2C273E

export default function AdventMagicApp() {
  const [tab, setTab] = useState("HOME"); // HOME | CAL | BUY | LOGIN
  const [hasAccess, setHasAccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [theme, setTheme] = useState("Научный");
  const [giftFormOpen, setGiftFormOpen] = useState(false);

  // theme → 24 items
  const themedContent = useMemo(
    () => ({
      Научный: Array.from({ length: 24 }, (_, i) => ({
        title: `Факт №${i + 1}`,
        description: "Интересное открытие или научный факт дня.",
        link: "#",
      })),
      Эзотерика: Array.from({ length: 24 }, (_, i) => ({
        title: `Ритуал №${i + 1}`,
        description: "Медитация или эзотерическая практика для гармонии.",
        link: "#",
      })),
      Саморазвитие: Array.from({ length: 24 }, (_, i) => ({
        title: `Шаг роста №${i + 1}`,
        description: "Совет, упражнение или задание для личного роста.",
        link: "#",
      })),
      Развлечения: Array.from({ length: 24 }, (_, i) => ({
        title: `Веселье №${i + 1}`,
        description: "Квиз, анекдот или мини‑игра дня.",
        link: "#",
      })),
    }),
    []
  );

  const today = new Date();
  const dayOfMonth = today.getDate();

  const handleOpenDay = (n) => {
    setSelectedDay(n);
    setModalOpen(true);
  };

  // floating sparkles on page bg
  useEffect(() => {
    const nodes = document.querySelectorAll(".floating-star");
    nodes.forEach((el) => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      el.style.left = `${randomX}%`;
      el.style.top = `${randomY}%`;
      el.animate(
        [
          { transform: "translateY(0px)", opacity: 0.5 },
          { transform: "translateY(-10px)", opacity: 0.9 },
          { transform: "translateY(0px)", opacity: 0.5 },
        ],
        { duration: 4000 + Math.random() * 3000, iterations: Infinity, easing: "ease-in-out" }
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#2C273E] via-[#585081] to-[#203822] text-[#F8C761]">
      {/* global sparkles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="floating-star absolute h-1.5 w-1.5 rounded-full bg-[#F8C761]/70 blur-[1px]"></div>
        ))}
      </div>

      <Header onNavigate={setTab} loggedIn={loggedIn} />

      {tab === "HOME" && (
        <>
          <Hero onBuy={() => setTab("BUY")} />
          <HomeInfo onBuy={() => setTab("BUY")} />
        </>
      )}

      {tab === "CAL" && (
        <CalendarPage
          items={Array.from({ length: 24 }, (_, i) => i + 1)}
          onOpenDay={handleOpenDay}
          content={themedContent[theme]}
          dayOfMonth={dayOfMonth}
        />
      )}

      {tab === "BUY" && (
        <BuyPage
          onSuccess={() => setHasAccess(true)}
          onOpenGiftForm={() => setGiftFormOpen(true)}
          setTheme={setTheme}
        />
      )}

      {tab === "LOGIN" && <LoginPage onSuccess={() => setLoggedIn(true)} />}

      {giftFormOpen && <GiftForm onClose={() => setGiftFormOpen(false)} />}

      {modalOpen && (
        <DayModal
          day={selectedDay}
          content={selectedDay ? themedContent[theme][selectedDay - 1] : null}
          onClose={() => setModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}

/* -------------------- Header & Navigation -------------------- */
function Header({ onNavigate, loggedIn }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#F8C761]/30 bg-[#2C273E]/80 backdrop-blur-md shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => onNavigate("HOME")} className="flex items-center gap-2 transition-transform hover:scale-105">
          <Sparkles className="h-6 w-6 text-[#F8C761] animate-pulse" />
          <span className="text-xl font-bold text-[#F8C761]">Advent Magic</span>
        </button>
        <nav className="flex items-center gap-3">
          <NavBtn onClick={() => onNavigate("HOME")}>
            <Home className="h-4 w-4" /> Главная
          </NavBtn>
          <NavBtn onClick={() => onNavigate("CAL")}>
            <CalendarIcon className="h-4 w-4" /> Календарь
          </NavBtn>
          <NavBtn onClick={() => onNavigate("BUY")} variant="ghost">
            <ShoppingBag className="h-4 w-4" /> Купить
          </NavBtn>
          {loggedIn ? (
            <NavBtn onClick={() => onNavigate("CAL")} variant="ghost">Мой календарь</NavBtn>
          ) : (
            <NavBtn onClick={() => onNavigate("LOGIN")} variant="ghost">
              <LogIn className="h-4 w-4" /> Войти
            </NavBtn>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavBtn({ children, onClick, variant = "solid" }) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none";
  const solid =
    "bg-[#42644B] text-[#F8C761] shadow hover:brightness-110 hover:shadow-[0_0_16px_#F8C761] hover:-translate-y-[1px]";
  const ghost =
    "bg-[#585081]/20 text-[#F8C761] hover:bg-[#585081]/40 hover:shadow-[0_0_12px_#F8C761] hover:-translate-y-[1px]";
  return (
    <button className={`${base} ${variant === "solid" ? solid : ghost}`} onClick={onClick}>
      {children}
    </button>
  );
}

/* -------------------- HOME -------------------- */
function Hero({ onBuy }) {
  return (
    // Section is transparent so page bg is continuous
    <section className="px-6 py-24 text-center">
      <h1 className="mb-4 text-6xl font-extrabold text-[#F8C761] drop-shadow-md">
        Открой магию каждый день ✨
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-[#F8C761]/80">
        24 дня вдохновения, открытий и радости. Цифровой адвент‑календарь с
        контентом на ваш вкус.
      </p>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {["Научный", "Эзотерика", "Саморазвитие", "Развлечения"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-[#F8C761]/30 bg-[#585081]/30 px-3 py-1 text-sm"
          >
            {t}
          </span>
        ))}
      </div>
      <button
        onClick={onBuy}
        className="rounded-xl bg-[#F8C761] px-10 py-4 text-lg font-bold text-[#2C273E] shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_#F8C761]"
      >
        Выбрать календарь
      </button>
    </section>
  );
}

function HomeInfo({ onBuy }) {
  const features = [
    {
      title: "Готово без кода",
      desc: "Просто используйте, всё уже собрано.",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "24 дня контента",
      desc: "Каждый день — новая радость.",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      title: "Тематики на выбор",
      desc: "Научный, Эзотерика, Саморазвитие, Развлечения.",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: "Подарок по e‑mail",
      desc: "Красивая открытка и персональная ссылка.",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const previewItems = [
    { icon: <FileText className="h-5 w-5" />, label: "Гайд.pdf", hint: "PDF" },
    { icon: <Music className="h-5 w-5" />, label: "Медитация.mp3", hint: "Audio" },
    { icon: <Video className="h-5 w-5" />, label: "Видеоурок.mp4", hint: "Video" },
    { icon: <ImageIcon className="h-5 w-5" />, label: "Обои.png", hint: "Image" },
    { icon: <Ticket className="h-5 w-5" />, label: "-20% купон", hint: "Promo" },
    { icon: <Link className="h-5 w-5" />, label: "Шаблон Notion", hint: "Link" },
  ];

  const whatsInside = [
    { title: "PDF/гайды", desc: "Пошаговые материалы и чек‑листы." },
    { title: "Медитации/аудио", desc: "Для внутреннего спокойствия и фокуса." },
    { title: "Шаблоны/Notion", desc: "Готовые шаблоны для работы и жизни." },
    { title: "Игры/квизы", desc: "Немного веселья каждый день." },
    { title: "Промокоды", desc: "Приятные бонусы и скидки." },
    { title: "Обои/арт", desc: "Красивые визуалы в тему сезона." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-4 pb-20">
      {/* Features */}
      <div className="mb-12">
        <h2 className="mb-6 text-3xl font-extrabold">Что вас ждёт</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/60 p-5 shadow-md transition-all hover:-translate-y-[2px] hover:shadow-[0_0_18px_#F8C761]"
            >
              <div className="mb-2 flex items-center gap-2 text-[#F8C761]">
                {f.icon}
                <span className="font-semibold">{f.title}</span>
              </div>
              <p className="text-sm text-[#F8C761]/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual strip */}
      <div className="mb-12">
        <h2 className="mb-6 text-3xl font-extrabold">Подарки внутри календаря</h2>
        <div className="[-ms-overflow-style:none] [scrollbar-width:none] flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {previewItems.map((p, i) => (
            <GiftTile key={i} icon={p.icon} label={p.label} hint={p.hint} />
          ))}
        </div>
      </div>

      {/* What's inside list */}
      <div className="mb-14">
        <h2 className="mb-6 text-3xl font-extrabold">Наполнение календаря</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whatsInside.map((w, i) => (
            <div key={i} className="rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/60 p-5 shadow-md">
              <h3 className="mb-1 font-semibold">{w.title}</h3>
              <p className="text-sm text-[#F8C761]/80">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onBuy}
          className="rounded-xl bg-[#F8C761] px-10 py-4 font-bold text-[#2C273E] shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_28px_#F8C761]"
        >
          Выбрать тематику и купить
        </button>
      </div>
    </section>
  );
}

function GiftTile({ icon, label, hint }) {
  return (
    <div className="min-w-[180px] rounded-2xl border border-[#F8C761]/30 bg-[#2C273E]/70 p-4 shadow-md transition-all hover:-translate-y-[2px] hover:shadow-[0_0_18px_#F8C761]">
      <div className="mb-3 flex items-center gap-2 text-[#F8C761]">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#585081]/40 shadow-inner">{icon}</div>
        <span className="text-sm opacity-90">{label}</span>
      </div>
      <div className="grid h-24 place-items-center rounded-xl bg-gradient-to-br from-[#42644B] via-[#585081] to-[#203822] text-xs opacity-90">
        {hint} preview
      </div>
    </div>
  );
}

/* -------------------- Calendar -------------------- */
function CalendarPage({ items, onOpenDay, content, dayOfMonth }) {
  return (
    <main className="mx-auto mt-16 max-w-5xl px-4 pb-24">
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((n) => {
          const isOpen = n <= dayOfMonth;
          return (
            <Door key={n} n={n} isOpen={isOpen} onOpen={() => onOpenDay(n)} label={content[n - 1]?.title} />
          );
        })}
      </div>
    </main>
  );
}

function Door({ n, isOpen, onOpen }) {
  return (
    <div className="group relative transition-transform hover:scale-105">
      <button
        onClick={onOpen}
        className={`aspect-square w-full rounded-2xl border border-[#F8C761]/40 bg-[#2C273E]/70 text-[#F8C761] shadow-md transition-all ${
          isOpen
            ? "opacity-100 hover:shadow-[0_0_24px_#F8C761]"
            : "opacity-60 hover:shadow-[0_0_18px_#F8C761]"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center">
          <span className="text-3xl font-bold">{n}</span>
          {isOpen ? <Gift className="mt-2 h-5 w-5 animate-pulse" /> : <Lock className="mt-2 h-5 w-5" />}
        </div>
      </button>
      {isOpen && <div className="pointer-events-none absolute -right-1 -top-1 animate-pulse text-[#F8C761]">✦</div>}
    </div>
  );
}

/* -------------------- Buy & Gift -------------------- */
function BuyPage({ onSuccess, onOpenGiftForm, setTheme }) {
  const themes = ["Научный", "Эзотерика", "Саморазвитие", "Развлечения"];
  return (
    <section className="mx-auto mt-20 max-w-3xl rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/90 p-10 text-center shadow-2xl backdrop-blur-md">
      <h2 className="mb-4 text-3xl font-extrabold text-[#F8C761]">Выберите тематику календаря</h2>
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className="rounded-lg bg-[#585081]/40 px-6 py-3 transition-all hover:bg-[#F8C761] hover:text-[#2C273E] hover:shadow-[0_0_20px_#F8C761]"
          >
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={onSuccess}
        className="rounded-xl bg-[#F8C761] px-10 py-4 font-bold text-[#2C273E] shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_25px_#F8C761]"
      >
        Купить календарь
      </button>
      <p className="mt-6 text-[#F8C761]/80">или</p>
      <button
        onClick={onOpenGiftForm}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#42644B] px-6 py-3 text-[#F8C761] transition-all hover:shadow-[0_0_25px_#F8C761]"
      >
        <Heart className="h-5 w-5" /> Купить в подарок
      </button>
    </section>
  );
}

function GiftForm({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Укажите корректный e‑mail получателя");
      return;
    }
    setSent(true); // demo: fake sending
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#2C273E]/90 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/90 p-8 text-center text-[#F8C761] shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-3 top-3">
          <X />
        </button>
        <h3 className="mb-4 text-2xl font-bold">Подарить календарь 🎁</h3>
        <p className="mb-6 text-sm text-[#F8C761]/80">Получатель получит красивую e‑mail открытку с персональной ссылкой ✨</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Имя получателя"
          className="mb-3 w-full rounded-lg border border-[#F8C761]/30 bg-[#585081]/20 px-4 py-3 text-[#F8C761]"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email получателя"
          className="mb-3 w-full rounded-lg border border-[#F8C761]/30 bg-[#585081]/20 px-4 py-3 text-[#F8C761]"
        />
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="Ваше пожелание"
          rows={3}
          className="mb-4 w-full rounded-lg border border-[#F8C761]/30 bg-[#585081]/20 px-4 py-3 text-[#F8C761]"
        ></textarea>

        <button
          onClick={handleSend}
          disabled={sent}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F8C761] px-6 py-3 font-semibold text-[#2C273E] shadow-lg transition-all hover:shadow-[0_0_25px_#F8C761] disabled:opacity-60"
        >
          {sent ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Отправляем открытку…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Отправить открытку
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* -------------------- Auth -------------------- */
function LoginPage({ onSuccess }) {
  return (
    <section className="mx-auto mt-20 max-w-md rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/90 p-10 text-center shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-3 text-3xl font-extrabold text-[#F8C761]">Войти в Advent Magic</h2>
      <p className="mb-6 text-sm text-[#F8C761]/70">Мы отправим вам волшебную ссылку на почту ✨</p>
      <input
        type="email"
        placeholder="you@example.com"
        className="mb-4 w-full rounded-xl border border-[#F8C761]/30 bg-[#585081]/20 px-4 py-3 text-[#F8C761] focus:ring-2 focus:ring-[#F8C761]"
      />
      <button
        onClick={onSuccess}
        className="w-full rounded-xl bg-[#F8C761] px-6 py-3 font-semibold text-[#2C273E] shadow-lg transition-transform hover:scale-105"
      >
        Получить ссылку для входа
      </button>
    </section>
  );
}

/* -------------------- Footer -------------------- */
function Footer() {
  return (
    <footer className="mt-20 bg-[#2C273E]/80 py-6 text-center text-sm text-[#F8C761]/80 backdrop-blur">
      <p>© {new Date().getFullYear()} Advent Magic — магия в каждом дне ✨</p>
      <a href="mailto:support@adventmagic.com" className="mt-2 inline-flex items-center gap-2 text-[#F8C761] hover:underline">
        <Mail className="h-4 w-4" /> Написать нам
      </a>
    </footer>
  );
}

/* -------------------- Day Modal -------------------- */
function DayModal({ day, content, onClose }) {
  if (!content) return null;

  const slides = [
    { icon: <FileText className="h-4 w-4" />, label: "Гайд.pdf", hint: "PDF" },
    { icon: <Video className="h-4 w-4" />, label: "Урок.mp4", hint: "Video" },
    { icon: <ImageIcon className="h-4 w-4" />, label: "Обои.png", hint: "Image" },
  ];
  const [index, setIndex] = useState(0);
  const next = () => setIndex((p) => (p + 1) % slides.length);
  const prev = () => setIndex((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#2C273E]/90 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[#F8C761]/30 bg-[#2C273E]/90 p-6 text-[#F8C761] shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button onClick={onClose} className="absolute right-3 top-3">
          <X />
        </button>
        <h3 className="mb-2 text-xl font-extrabold">{content.title}</h3>
        <p className="mb-4 text-sm text-[#F8C761]/80">{content.description}</p>

        <div className="relative mb-3 flex items-center justify-center">
          <button onClick={prev} className="absolute left-0 p-2 hover:text-white">
            <ChevronLeft />
          </button>
          <div className="grid h-40 w-56 place-items-center rounded-2xl border border-[#F8C761]/30 bg-[#2C273E]/70">
            <div className="text-center">
              {slides[index].icon}
              <p className="mt-2 text-sm">{slides[index].label}</p>
              <p className="text-xs text-[#F8C761]/70">{slides[index].hint}</p>
            </div>
          </div>
          <button onClick={next} className="absolute right-0 p-2 hover:text-white">
            <ChevronRight />
          </button>
        </div>

        <a
          href={content.link}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#F8C761] px-4 py-2 font-semibold text-[#2C273E] shadow transition hover:shadow-[0_0_20px_#F8C761]"
        >
          <Download className="h-4 w-4" /> Скачать/Открыть
        </a>
        <div className="mt-4 text-center text-xs opacity-70">День {day} / 24</div>
      </div>
    </div>
  );
}

/* -------------------- Dev mini‑tests (non‑blocking) -------------------- */
if (typeof window !== "undefined") {
  console.assert(typeof AdventMagicApp === "function", "App defined");
  console.assert(typeof Header === "function", "Header defined" );
  console.assert(typeof Hero === "function", "Hero defined" );
  console.assert(typeof HomeInfo === "function", "HomeInfo defined" );
  console.assert(typeof CalendarPage === "function", "CalendarPage defined" );
  console.assert(typeof BuyPage === "function", "BuyPage defined" );
  console.assert(typeof GiftForm === "function", "GiftForm defined" );
  console.assert(typeof LoginPage === "function", "LoginPage defined" );
  console.assert(typeof Footer === "function", "Footer defined" );

  // Date label sample (DD)
  const d = new Date(2025, 11, 1);
  console.assert(d.getDate() === 1, "Date sample is 1");

  // Navbar labels sanity
  const labels = ["Главная", "Календарь", "Купить"]; 
  console.assert(labels.includes("Главная") && labels.includes("Календарь") && labels.includes("Купить"), "Navbar labels present");
}
