import { Box } from '@/components/system/Box';
import { cn } from '@/lib/design/utils';

import { DetailNavigationLink } from './DetailNavigationLink';

/** 詳細画面の前後移動リンク1件分。titleはaccessible nameにも利用される。 */
export type DetailNavigationItem = {
  href: string;
  label: string;
  title: string;
};

/**
 * 詳細画面間の前後移動を表示するProps。
 *
 * previous・nextのどちらもない場合はナビゲーション自体を表示しない。
 */
type DetailNavigationProps = {
  previous?: DetailNavigationItem;
  next?: DetailNavigationItem;
  /** モバイル時の配置。desktopでは常に左右配置になる。 */
  mobileLayout?: 'stack' | 'row';
  /** trueの場合、モバイルではtitleを隠しつつlabelとリンク先を維持する。 */
  hideTitleOnMobile?: boolean;
};

export function DetailNavigation({
  previous,
  next,
  mobileLayout = 'stack',
  hideTitleOnMobile = false,
}: Readonly<DetailNavigationProps>) {
  if (!previous && !next) {
    return null;
  }

  return (
    <Box
      as="nav"
      aria-label="詳細ページ内の移動"
      className={cn(
        'border-border/75 flex gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5',
        mobileLayout === 'row'
          ? 'flex-row items-center justify-between'
          : 'flex-col'
      )}
    >
      {previous ? (
        <DetailNavigationLink
          direction="previous"
          item={previous}
          mobileLayout={mobileLayout}
          hideTitleOnMobile={hideTitleOnMobile}
        />
      ) : null}
      {next ? (
        <DetailNavigationLink
          direction="next"
          item={next}
          mobileLayout={mobileLayout}
          hideTitleOnMobile={hideTitleOnMobile}
          className={!previous ? 'ml-auto sm:ml-auto' : undefined}
        />
      ) : null}
    </Box>
  );
}
