import React from 'react';
import TopicTemplate from '@/components/TopicTemplate';
import { Metadata } from 'next';
import { topicsData } from '@/data/topics';

export function generateMetadata(): Metadata {
  const topic = topicsData.find(t => t.id === 13);
  return {
    title: `${topic?.id}. ${topic?.shortTitle} | Magnum Documentation`,
    description: topic?.title,
  };
}

export default function Page() {
  return <TopicTemplate id={13} />;
}
