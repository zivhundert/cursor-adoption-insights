
import { Shield } from 'lucide-react';

export const PrivacyFooter = () => {
  return (
    <footer className="mt-16 py-6 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>
            This website collects anonymous usage data to help us track issues and improve the user experience. 
            No personal information is stored or shared.
          </span>
        </div>
      </div>
    </footer>
  );
};
