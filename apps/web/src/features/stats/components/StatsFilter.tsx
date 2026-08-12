import { Switch } from '@/components/ui/switch';

/**
 * Stats一覧の規定到達フィルターProps。
 *
 * controlled Componentとして、切替後のbooleanをcallbackで親へ返す。
 */
type StatsFilterProps = {
  /** trueの場合、表示中の成績カテゴリで規定打席または規定投球回に到達した選手だけを表示する。 */
  qualifiedOnly: boolean;
  /** Switch操作後の新しい規定到達フィルター値を渡す。 */
  onQualifiedOnlyChange: (value: boolean) => void;
};

export function StatsFilter({
  qualifiedOnly,
  onQualifiedOnlyChange,
}: Readonly<StatsFilterProps>) {
  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-2">
      <Switch checked={qualifiedOnly} onCheckedChange={onQualifiedOnlyChange} />
      <span className="text-sm whitespace-nowrap">規定到達のみ</span>
    </label>
  );
}
