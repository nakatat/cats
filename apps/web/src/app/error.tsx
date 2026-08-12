'use client';

import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

import { PageState } from '@/components/layout/PageState';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <PageState
      code="ERROR"
      title="エラーが発生しました"
      description="ページの読み込みに失敗しました。時間をおいて再度お試しください。"
      icon={<TriangleAlert className="size-7" />}
      actions={
        <>
          <Button type="button" onClick={reset}>
            再試行
          </Button>
          <Button asChild variant="outline">
            <Link href="/">トップへ戻る</Link>
          </Button>
        </>
      }
    />
  );
}
