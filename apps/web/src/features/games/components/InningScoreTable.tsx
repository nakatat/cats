import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/design/utils';

import type { InningScoreRow, InningScoreStatus } from './game-detail.types';

/**
 * 試合のイニングスコア表を表示するProps。
 *
 * rowsが空の場合はstatusに応じた未登録メッセージを表示し、embeddedでは外側のCardを省略する。
 */
type InningScoreTableProps = {
  /** 1行目から順に並んだチーム別スコア。 */
  rows: InningScoreRow[];
  /** 表の下に表示する補足。改行を保持して表示する。 */
  note?: string | null;
  /** rowsが空の場合の登録状態。 */
  status?: InningScoreStatus;
  /** API取得失敗時はrowsより優先してエラー表示する。 */
  error?: boolean;
  /** trueの場合はCardで囲まず、親のレイアウトへ埋め込む。 */
  embedded?: boolean;
};

export function InningScoreTable({
  rows,
  note,
  status,
  error,
  embedded = false,
}: Readonly<InningScoreTableProps>) {
  const inningCount = Math.max(...rows.map((row) => row.innings.length), 0);
  const innings = Array.from({ length: inningCount }, (_, index) => index + 1);

  const content = (
    <>
      {error ? (
        <Box surface="muted" className="p-6 text-center">
          <Typography as="p" variant="bodySm" tone="muted">
            取得できませんでした。
          </Typography>
        </Box>
      ) : rows.length > 0 ? (
        <Table className="table-fixed text-xs sm:min-w-190 sm:text-sm">
          <TableHeader>
            <TableRow className="bg-muted/45 hover:bg-muted/45">
              <TableHead className="w-10 px-1 sm:w-40 sm:px-2" />
              {innings.map((inning) => (
                <TableHead
                  key={inning}
                  className={cn(
                    'px-1 text-center tabular-nums sm:px-2',
                    inning === inningCount && 'pr-3 sm:pr-4'
                  )}
                >
                  {inning}
                </TableHead>
              ))}
              <TableHead className="px-1 pl-3 text-center sm:px-2 sm:pl-4">
                R
              </TableHead>
              <TableHead className="px-1 text-center sm:px-2">H</TableHead>
              <TableHead className="px-1 text-center sm:px-2">E</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const logoSrc =
                row.logoUrl ??
                (row.teamName.includes('CATS')
                  ? '/brand/cats-logo-mark.png'
                  : undefined);

              return (
                <TableRow key={row.scoreLineId ?? row.teamName}>
                  <TableHead
                    scope="row"
                    aria-label={row.teamName}
                    title={row.teamName}
                    className="w-10 max-w-10 px-1 text-xs font-semibold sm:w-40 sm:max-w-none sm:px-2 sm:text-sm"
                  >
                    <span className="sr-only">{row.teamName}</span>
                    <span aria-hidden="true" className="hidden sm:inline">
                      {row.teamName}
                    </span>
                    <Avatar
                      aria-hidden="true"
                      size="sm"
                      className={
                        logoSrc
                          ? 'mx-auto size-6 rounded-xl bg-transparent after:hidden sm:hidden'
                          : 'mx-auto size-6 bg-neutral-800 text-white after:hidden sm:hidden'
                      }
                    >
                      {logoSrc ? (
                        <AvatarImage
                          alt=""
                          src={logoSrc}
                          className="rounded-none object-contain"
                        />
                      ) : null}
                      <AvatarFallback className="bg-neutral-800 text-xs font-bold text-white">
                        {row.teamName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </TableHead>
                  {innings.map((inning, index) => (
                    <TableCell
                      key={`${row.scoreLineId ?? row.teamName}-${inning}`}
                      className={cn(
                        'px-1 text-center tabular-nums sm:px-2',
                        inning === inningCount && 'pr-3 sm:pr-4'
                      )}
                    >
                      {row.innings[index] ?? '–'}
                    </TableCell>
                  ))}
                  <TableCell className="text-primary px-1 pl-3 text-center font-bold tabular-nums sm:px-2 sm:pl-4">
                    {row.runs}
                  </TableCell>
                  <TableCell className="px-1 text-center tabular-nums sm:px-2">
                    {row.hits}
                  </TableCell>
                  <TableCell className="px-1 text-center tabular-nums sm:px-2">
                    {row.errors}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Box surface="muted" className="p-6 text-center">
          <Typography as="p" variant="bodySm" tone="muted">
            {status === 'draft' ? '入力途中です。' : 'まだ登録されていません。'}
          </Typography>
        </Box>
      )}
      {note ? (
        <Typography
          as="p"
          variant="caption"
          tone="muted"
          className="whitespace-pre-line"
        >
          {note}
        </Typography>
      ) : null}
    </>
  );

  return embedded ? (
    <Box display="flex" direction="column" gap="lg" className="min-w-0">
      {content}
    </Box>
  ) : (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      {content}
    </Card>
  );
}
