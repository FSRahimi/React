
import { useState } from "react";
import { useTheme, type Theme } from "../context/ThemeContext";

function Code({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-3 text-xs text-slate-400">
        {title}
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-cyan-100 sm:text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-5 flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Explanation({
  title,
  children,
  color = "indigo",
}: {
  title: string;
  children: React.ReactNode;
  color?: "indigo" | "green" | "red" | "amber";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200",
    green: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    red: "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
    amber: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  };

  return (
    <div className={`rounded-xl p-4 text-sm leading-6 ${colors[color]}`}>
      <strong>{title}</strong>
      <p className="mt-1">{children}</p>
    </div>
  );
}

// =============================================
// 1. PROP DRILLING
// =============================================

function DeepChild({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-xl border border-emerald-400 bg-emerald-50 p-4 dark:bg-emerald-950">
      <h4 className="font-bold text-emerald-800 dark:text-emerald-200">
        DeepChild
      </h4>
      <p className="mt-2 text-sm">
        I actually use the theme: <strong>{theme}</strong>
      </p>
    </div>
  );
}

function Content({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-xl border border-slate-300 p-3 dark:border-slate-700">
      <p className="mb-3 font-semibold">Content</p>
      <DeepChild theme={theme} />
    </div>
  );
}

function Sidebar({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-xl border border-slate-300 p-3 dark:border-slate-700">
      <p className="font-semibold">Sidebar</p>
      <p className="mb-3 text-xs text-rose-600 dark:text-rose-300">
        Passes theme but doesn't use it
      </p>
      <Content theme={theme} />
    </div>
  );
}

function PropDrilling() {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div className="space-y-4">
      <button
        onClick={() =>
          setTheme((current) =>
            current === "light" ? "dark" : "light"
          )
        }
        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Change theme: {theme}
      </button>

      <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
        <p className="mb-3 font-bold text-rose-800 dark:text-rose-200">
          App → Layout → Sidebar → Content → DeepChild
        </p>
        <Sidebar theme={theme} />
      </div>

      <Code title="PropDrilling.tsx">
{`function App() {
  const [theme, setTheme] = useState("light");
  return <Layout theme={theme} />;
}

function Layout({ theme }) {
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {
  return <Content theme={theme} />;
}

function Content({ theme }) {
  return <DeepChild theme={theme} />;
}

function DeepChild({ theme }) {
  return <p>{theme}</p>;
}`}
      </Code>

      <Explanation title="The problem" color="red">
        Every intermediate component must receive and forward props,
        even when it doesn't use them. This creates unnecessary
        dependencies between components.
      </Explanation>
    </div>
  );
}

// =============================================
// 2. CREATECONTEXT / USECONTEXT
// =============================================

function ContextDemo() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {["Layout", "Sidebar", "Content"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700"
          >
            <strong>{item}</strong>
            <p className="mt-2 text-xs text-slate-500">
              No theme prop needed
            </p>
          </div>
        ))}
      </div>

      <div className="text-center text-2xl text-emerald-500">↓</div>

      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 dark:bg-emerald-950/30">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-200">
          DeepChild accesses Context directly
        </h3>

        <p className="mt-3 text-sm">
          Current theme: <strong>{theme}</strong>
        </p>

        <button
          onClick={toggleTheme}
          className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white"
        >
          Toggle shared theme
        </button>
      </div>

      <Code title="DeepChild.tsx">
{`function DeepChild() {
  const { theme } = useTheme();

  return <p>{theme}</p>;
}

// No theme prop through:
// Layout → Sidebar → Content`}
      </Code>

      <Explanation title="The solution" color="green">
        Context makes shared values available to descendants without
        passing props through every intermediate component.
      </Explanation>
    </div>
  );
}

// =============================================
// 3. TYPESCRIPT CONTEXT
// =============================================

function TypingDemo() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        <h3 className="font-bold text-indigo-700 dark:text-indigo-300">
          Step 1: Define the type
        </h3>

        <Code title="ThemeContext.tsx">
{`type ThemeContextValue = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);`}
        </Code>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          Null represents the possibility that a component is not
          receiving a value from a Provider.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-emerald-700 dark:text-emerald-300">
          Step 2: Create a custom hook
        </h3>

        <Code title="useTheme.ts">
{`function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}`}
        </Code>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          TypeScript narrows the type after the null check.
          Consumers receive a non-null ThemeContextValue.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Explanation title="Important">
          The custom hook does not change the original Context type.
          It checks the value and guarantees a non-null result to
          components using the hook.
        </Explanation>
      </div>
    </div>
  );
}

// =============================================
// 4. DARK MODE PROVIDER
// =============================================

function DarkModeDemo() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
              Live preview
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Current theme: {theme}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Toggle appearance
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
            <strong>Background</strong>
            <code className="mt-2 block text-xs">
              dark:bg-slate-800
            </code>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
            <strong>Text</strong>
            <code className="mt-2 block text-xs">
              dark:text-white
            </code>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
            <strong>Accent</strong>
            <code className="mt-2 block text-xs">
              dark:bg-emerald-950
            </code>
          </div>
        </div>
      </div>

      <Code title="ThemeProvider.tsx">
{`useEffect(() => {
  document.documentElement.classList.toggle(
    "dark",
    theme === "dark"
  );
}, [theme]);`}
      </Code>
    </div>
  );
}

// =============================================
// 5. WHAT BELONGS IN CONTEXT?
// =============================================

const goodItems = [
  {
    icon: "🎨",
    title: "Theme",
    description: "Shared light and dark appearance settings.",
    example: "theme, toggleTheme",
  },
  {
    icon: "🔐",
    title: "Authentication",
    description: "Current user and session information.",
    example: "user, isAuthenticated",
  },
  {
    icon: "🛒",
    title: "Shopping cart",
    description: "Cart items shared across multiple pages.",
    example: "items, addItem, removeItem",
  },
];

const localItems = [
  {
    icon: "📝",
    title: "Form inputs",
    description: "Temporary values inside one form.",
    example: "inputValue",
  },
  {
    icon: "🪟",
    title: "Local UI state",
    description: "Modal, dropdown, tooltip, active tab.",
    example: "isOpen, activeTab",
  },
  {
    icon: "⏳",
    title: "Temporary request state",
    description: "Loading or error state for one component.",
    example: "isLoading, error",
  },
];

function BestPractices() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h3 className="mb-4 text-lg font-bold text-emerald-800 dark:text-emerald-300">
          ✓ Good candidates for Context
        </h3>

        {goodItems.map((item) => (
          <div
            key={item.title}
            className="mb-3 rounded-xl bg-white p-4 dark:bg-slate-900"
          >
            <strong>{item.icon} {item.title}</strong>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
            <code className="mt-2 block text-xs text-emerald-700 dark:text-emerald-300">
              {item.example}
            </code>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
        <h3 className="mb-4 text-lg font-bold text-amber-800 dark:text-amber-300">
          ◇ Keep these local
        </h3>

        {localItems.map((item) => (
          <div
            key={item.title}
            className="mb-3 rounded-xl bg-white p-4 dark:bg-slate-900"
          >
            <strong>{item.icon} {item.title}</strong>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
            <code className="mt-2 block text-xs text-amber-700 dark:text-amber-300">
              {item.example}
            </code>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2">
        <Explanation title="Rule of thumb">
          Use Context when multiple components need the same shared
          value. Keep component-specific state local. Not every
          shared value needs Context.
        </Explanation>
      </div>
    </div>
  );
}

// =============================================
// MAIN PAGE
// =============================================

export default function ReactContextPage() {
  return (
    <div className="min-h-screen space-y-7 bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6">
      <header className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-indigo-700 to-violet-700 p-8 text-white sm:p-12">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          REACT + TYPESCRIPT
        </span>

        <h1 className="mt-5 text-4xl font-black sm:text-6xl">
          React Context Guide
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-indigo-100">
          Learn prop drilling, createContext, useContext,
          TypeScript Context, dark mode, and state management.
        </p>
      </header>

      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-2">
        {[
          ["prop-drilling", "Prop drilling"],
          ["context", "Context API"],
          ["typing", "Type safety"],
          ["dark-mode", "Dark mode"],
          ["best-practices", "Best practices"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
          >
            {label}
          </a>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl space-y-7">
        <Section
          id="prop-drilling"
          number="01"
          title="Prop drilling"
          description="Passing props through components that don't use them."
        >
          <PropDrilling />
        </Section>

        <Section
          id="context"
          number="02"
          title="createContext / useContext"
          description="Make a value available throughout a subtree."
        >
          <ContextDemo />
        </Section>

        <Section
          id="typing"
          number="03"
          title="Typing Context"
          description="Create a nullable Context and a custom hook."
        >
          <TypingDemo />
        </Section>

        <Section
          id="dark-mode"
          number="04"
          title="Dark mode Provider"
          description="Connect React state to Tailwind dark: classes."
        >
          <DarkModeDemo />
        </Section>

        <Section
          id="best-practices"
          number="05"
          title="What belongs in Context?"
          description="Theme, authentication, cart versus local state."
        >
          <BestPractices />
        </Section>
      </main>

      <footer className="mx-auto max-w-6xl rounded-2xl border border-slate-200 p-6 text-center dark:border-slate-700">
        <p className="font-bold">Build clean. Share intentionally. Type safely.</p>
        <p className="mt-2 text-sm text-slate-500">
          React Context Learning Page
        </p>
      </footer>
    </div>
  );
}
