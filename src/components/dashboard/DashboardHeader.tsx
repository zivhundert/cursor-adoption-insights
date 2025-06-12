
import { BarChart3 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const DashboardHeader = () => {
  return (
    <header className="text-center relative">
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
          Cursor Adoption & Impact
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Visualize your team's AI coding assistant usage and productivity metrics from Cursor admin panel data
      </p>
    </header>
  );
};
