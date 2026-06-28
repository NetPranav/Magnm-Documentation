import ProjectRunner from '@/components/ProjectRunner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Mode | Magnum Documentation',
  description: 'Learn Node.js by building a real-time collaborative text editor.',
};

export default function ProjectModePage() {
  return (
    <div className="h-full w-full flex flex-col p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Capstone: Real-Time Collaborative Text Editor
        </h1>
        <p className="text-text-secondary mt-2">
          Master Node.js by building a WebSockets-based real-time editor from scratch. 
          The AI will guide you through all 40 topics, step by step.
        </p>
      </div>
      
      <div className="flex-1 bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <ProjectRunner />
      </div>
    </div>
  );
}
