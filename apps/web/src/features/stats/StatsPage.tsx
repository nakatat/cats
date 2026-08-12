import { StatsPageLayout } from './components/StatsPageLayout';
import type { StatsViewData } from './data/stats';
import { StatsPageContent } from './StatsPageContent';

type StatsPageProps = {
  data: StatsViewData;
};

export function StatsPage({ data }: Readonly<StatsPageProps>) {
  return (
    <StatsPageLayout>
      <StatsPageContent data={data} />
    </StatsPageLayout>
  );
}
