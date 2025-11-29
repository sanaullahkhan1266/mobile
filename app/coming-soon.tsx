import React from 'react';
import ComingSoon from '@/components/ComingSoon';
import { useLocalSearchParams } from 'expo-router';

export default function ComingSoonRoute() {
  const params = useLocalSearchParams<{ title?: string; description?: string; icon?: string }>();
  const title = typeof params.title === 'string' ? params.title : 'Coming Soon';
  const description = typeof params.description === 'string' ? params.description : 'This page is coming soon.';
  const icon = typeof params.icon === 'string' ? (params.icon as any) : 'hourglass';

  return <ComingSoon title={title} description={description} icon={icon} />;
}
