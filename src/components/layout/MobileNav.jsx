import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  CheckSquare,
  Trophy,
} from "lucide-react";

export const MOBILE_ITEMS = [
  { id: "overview",    label: "Home",      icon: LayoutDashboard },
  { id: "exams",       label: "Exams",     icon: BookOpen },
  { id: "questions",   label: "Questions", icon: FileQuestion },
  { id: "results",     label: "Results",   icon: CheckSquare },
  { id: "leaderboard", label: "Students",  icon: Trophy },
];

export default function MobileNav({ activeTab, onSelectTab }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation bar">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => onSelectTab(item.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
