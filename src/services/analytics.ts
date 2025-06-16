
// Analytics service for tracking user interactions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const analytics = {
  // Track file upload events
  trackFileUpload: (fileSize?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'file_upload', {
        event_category: 'engagement',
        event_label: 'csv_upload',
        file_size: fileSize || 0
      });
    }
  },

  // Track export events
  trackExport: (exportType: 'image' | 'pdf' = 'image') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'export_dashboard', {
        event_category: 'engagement',
        event_label: exportType,
        export_type: exportType
      });
    }
  },

  // Track filter usage
  trackFilterUsage: (filterType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_applied', {
        event_category: 'interaction',
        event_label: filterType,
        filter_type: filterType
      });
    }
  },

  // Track CSV reload
  trackCsvReload: () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'csv_reload', {
        event_category: 'engagement',
        event_label: 'reload_data'
      });
    }
  },

  // Track settings access
  trackSettingsOpen: () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'settings_opened', {
        event_category: 'interaction',
        event_label: 'dashboard_settings'
      });
    }
  }
};
