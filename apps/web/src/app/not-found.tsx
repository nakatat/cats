import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

import { PageState } from '@/components/layout/PageState';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PageState
      code="404"
      title="ページが見つかりません"
      description="指定されたページは見つかりませんでした。URLをご確認いただくか、トップページへ戻ってください。"
      icon={<FileQuestion className="size-7" />}
      actions={
        <Button asChild>
          <Link href="/">トップへ戻る</Link>
        </Button>
      }
    />
  );
}
