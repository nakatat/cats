import Link from 'next/link';

import { PageIntro } from '@/components/layout/PageIntro';
import { Box } from '@/components/system/Box';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function StatsPageHeader() {
  return (
    <Box display="flex" direction="column" gap="lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">トップ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>成績一覧</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageIntro
        iconSrc="/icons/icon-batting.png"
        title="成績一覧"
        description="選手成績をシーズン別・通算で確認できます。"
      />
    </Box>
  );
}
