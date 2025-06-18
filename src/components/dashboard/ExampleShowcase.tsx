
import { Download, Sparkles, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analytics } from '@/services/analytics';

export const ExampleShowcase = () => {
  const handleDownloadExample = () => {
    // Track download event
    analytics.trackExport('image');
    
    // Create download link
    const link = document.createElement('a');
    link.href = '/example.png';
    link.download = 'cursor-dashboard-example.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="max-w-4xl mx-auto mb-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 border-2 border-blue-200 shadow-xl">
      <div className="p-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
              Real Success Story
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Actual Results from a Mid-Size Company
          </h3>
          <p className="text-lg text-gray-600">
            After just 2 months with Cursor AI - This could be your team's dashboard!
          </p>
        </div>

        {/* Example Image with Overlay */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white p-2 rounded-xl shadow-lg">
            <img 
              src="/example.png" 
              alt="Cursor AI Dashboard Example - Real company results showing 107K+ lines accepted, $59K+ saved"
              className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            
            {/* Success Badge Overlay */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold text-sm">Proven ROI</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-100">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">107K+</span>
            </div>
            <p className="text-sm text-gray-600">Lines of Code Accepted</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">$59K+</span>
            </div>
            <p className="text-sm text-gray-600">Development Cost Saved</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-100">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">480%</span>
            </div>
            <p className="text-sm text-gray-600">Return on Investment</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            📊 Want to see these insights for your own team?
          </p>
          <p className="text-gray-600 mb-4">
            Download this example or upload your team's Cursor data to get started instantly
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={handleDownloadExample}
              variant="outline"
              className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Example
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                const uploadSection = document.querySelector('[data-upload-section]');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upload Your Data Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
