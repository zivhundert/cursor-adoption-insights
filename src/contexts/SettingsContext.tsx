
import React, { createContext, useContext, useEffect, useState } from "react";

type ChartVisibility = {
  cumulativeChart: boolean;
  acceptanceRateChart: boolean;
  modelUsageChart: boolean;
  chatRequestTypesChart: boolean;
  averageAskRequestsChart: boolean;
  averageTabsAcceptedChart: boolean;
  tabExtensionWordCloud: boolean;
  programmingLanguageTreemap: boolean;
  dayOfWeekChart: boolean;
  clientVersionChart: boolean;
  topContributorsTable: boolean;
};

type Settings = {
  linesPerMinute: number;
  theme: "light" | "dark";
  pricePerHour: number;
  cursorPricePerUser: number;
  chartVisibility: ChartVisibility;
};

type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggleChartVisibility: (chartKey: keyof ChartVisibility) => void;
  showAllCharts: () => void;
  hideAllCharts: () => void;
  resetDefaults: () => void;
};

const DEFAULT_CHART_VISIBILITY: ChartVisibility = {
  cumulativeChart: true,
  acceptanceRateChart: true,
  modelUsageChart: true,
  chatRequestTypesChart: true,
  averageAskRequestsChart: true,
  averageTabsAcceptedChart: true,
  tabExtensionWordCloud: true,
  programmingLanguageTreemap: true,
  dayOfWeekChart: true,
  clientVersionChart: true,
  topContributorsTable: true,
};

const DEFAULT_SETTINGS: Settings = {
  linesPerMinute: 10,
  theme: "light",
  pricePerHour: 55,
  cursorPricePerUser: 32,
  chartVisibility: DEFAULT_CHART_VISIBILITY,
};

const LOCALSTORAGE_KEY = "dashboard_settings_v1";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        // Ensure chartVisibility exists for backwards compatibility
        if (!parsedSettings.chartVisibility) {
          parsedSettings.chartVisibility = DEFAULT_CHART_VISIBILITY;
        }
        return parsedSettings;
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleChartVisibility = (chartKey: keyof ChartVisibility) => {
    setSettings(prev => ({
      ...prev,
      chartVisibility: {
        ...prev.chartVisibility,
        [chartKey]: !prev.chartVisibility[chartKey]
      }
    }));
  };

  const showAllCharts = () => {
    setSettings(prev => ({
      ...prev,
      chartVisibility: DEFAULT_CHART_VISIBILITY
    }));
  };

  const hideAllCharts = () => {
    const hiddenCharts = Object.keys(DEFAULT_CHART_VISIBILITY).reduce((acc, key) => {
      acc[key as keyof ChartVisibility] = false;
      return acc;
    }, {} as ChartVisibility);
    
    setSettings(prev => ({
      ...prev,
      chartVisibility: hiddenCharts
    }));
  };

  const resetDefaults = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      updateSetting, 
      toggleChartVisibility,
      showAllCharts,
      hideAllCharts,
      resetDefaults 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
