import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Box } from '@/components/system/Box';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

type NavigationCardProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

export function NavigationCard({
  href,
  title,
  description,
  icon,
}: Readonly<NavigationCardProps>) {
  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring focus-visible:ring-offset-background block h-full rounded-xl focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Card className="border-border/70 group-hover:border-primary/25 group-focus-visible:border-ring h-full bg-white py-0 shadow-[0_14px_30px_rgba(17,24,39,0.04)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_20px_42px_rgba(11,79,42,0.08)] sm:py-3">
        <CardContent className="p-3 text-left sm:p-4">
          <Box display="flex" align="center" gap="md" className="h-full">
            <Box
              display="flex"
              align="center"
              gap="sm"
              className="min-w-0 flex-1 flex-col md:flex-row md:gap-3"
            >
              <span className="flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-[1.01]">
                <Image
                  src={icon}
                  alt=""
                  width={96}
                  height={96}
                  className="size-12 object-contain md:size-14"
                />
              </span>
              <Box
                display="flex"
                direction="column"
                gap="xs"
                className="min-w-0 items-center md:items-start"
              >
                <CardTitle className="w-full text-center text-sm md:text-left md:text-base">
                  <span className="relative inline-block whitespace-nowrap">
                    {title}
                    <ChevronRight
                      aria-hidden="true"
                      className="text-primary absolute top-1/2 left-full ml-1 size-4 -translate-y-1/2"
                    />
                  </span>
                </CardTitle>
                <CardDescription className="hidden text-sm leading-6 md:block">
                  {description}
                </CardDescription>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
