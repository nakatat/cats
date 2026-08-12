import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const sections = [
  { value: 'batting', label: '打撃成績', mobileLabel: '打撃' },
  { value: 'pitching', label: '投手成績', mobileLabel: '投手' },
] as const;

export function StatsSectionNavigation() {
  return (
    <TabsList
      variant="line"
      className="w-full justify-start sm:w-auto"
      aria-label="成績一覧の表示切り替え"
    >
      {sections.map((section) => (
        <TabsTrigger
          key={section.value}
          value={section.value}
          className="flex-1 px-4 py-3 text-base sm:flex-none sm:px-5"
        >
          <span className="sm:hidden">{section.mobileLabel}</span>
          <span className="hidden sm:inline">{section.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
