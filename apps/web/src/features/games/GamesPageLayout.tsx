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

export function GamesPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-6 lg:pb-8"
    >
      <Box display="flex" direction="column" gap="xl">
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
                <BreadcrumbPage>試合一覧</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <PageIntro
            iconSrc="/icons/icon-games.png"
            title="試合一覧"
            description="新琴似CATSの試合結果をご覧いただけます。"
          />
        </Box>

        {children}
      </Box>
    </Box>
  );
}
