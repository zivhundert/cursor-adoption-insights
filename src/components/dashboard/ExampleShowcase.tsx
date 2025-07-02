
import { Download, Sparkles, TrendingUp, Users, DollarSign, Lock } from 'lucide-react';
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
    link.href = '/fullreport.png';
    link.download = 'cursor-full-report-example.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full mx-auto mb-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 border-2 border-blue-200 shadow-xl">
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
            Real Results from a Mid-Size Company
          </h3>
          <p className="text-lg text-gray-600">
            After just 2 months with Cursor AI - this could be your team's dashboard!
          </p>
        </div>

        {/* Example Image with Half-Blur Effect */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white p-2 rounded-xl shadow-lg overflow-hidden">
            {/* Image Container with Clip Path */}
            <div className="relative">
              <img 
                src="/example.png" 
                alt="Cursor AI Dashboard Example - Partial View"
                className="w-full rounded-lg shadow-md"
              />
              
              {/* Gradient Overlay on Bottom Half */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent pointer-events-none rounded-lg"></div>
              
              {/* Blur Overlay on Bottom Half */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-md rounded-b-lg"
                style={{
                  background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
                }}
              ></div>
            </div>
            
            {/* Success Badge Overlay */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold text-sm">Proven ROI</span>
            </div>

            {/* Bottom Overlay with "More Content" Message */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-lg p-4 shadow-xl">
              <div className="flex items-center justify-center mb-2">
                <Lock className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-bold text-gray-900 text-center">📊 This is just the beginning...</h4>
              </div>
              
              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p className="font-semibold text-center">The full dashboard includes:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <span>✓ 15+ detailed charts</span>
                  <span>✓ Team performance analysis</span>
                  <span>✓ Cost breakdown by user</span>
                  <span>✓ Programming language insights</span>
                  <span>✓ Export to PDF & images</span>
                </div>
              </div>
              
              <Button 
                onClick={handleDownloadExample}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Full Report Example
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Highlights - Only Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-100">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">107K+</span>
            </div>
            <p className="text-sm text-gray-600">Code lines accepted</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">$59K+</span>
            </div>
            <p className="text-sm text-gray-600">Development cost savings</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-100">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-bold text-2xl text-gray-900">480%</span>
            </div>
            <p className="text-sm text-gray-600">Return on investment</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            📊 Want to see insights like these for your team?
          </p>
          <p className="text-gray-600 mb-4">
            Download this example or upload your team's Cursor data to get started instantly
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={() => {
                // Track download event
                analytics.trackExport('image');
                
                // Create download link for CSV
                const link = document.createElement('a');
                link.href = '/cursor_analytics.csv';
                link.download = 'cursor-analytics-example.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              variant="outline"
              className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Example
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
