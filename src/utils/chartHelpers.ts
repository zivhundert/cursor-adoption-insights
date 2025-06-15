
import Highcharts from 'highcharts';

// Common tooltip formatters
export const createDateTooltipFormatter = (seriesName: string, valueFormatter?: (value: number) => string) => {
  return function(this: any) {
    const formattedValue = valueFormatter ? valueFormatter(this.y as number) : (this.y as number).toLocaleString();
    return `Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
            ${seriesName}: <b>${formattedValue}</b>`;
  };
};

export const createCategoryTooltipFormatter = (seriesName: string, valueFormatter?: (value: number) => string) => {
  return function(this: any) {
    const formattedValue = valueFormatter ? valueFormatter(this.y as number) : (this.y as number).toLocaleString();
    return `${this.x}<br/>
            ${seriesName}: <b>${formattedValue}</b>`;
  };
};

export const createPercentageFormatter = () => {
  return function(this: any) {
    return this.value + '%';
  };
};

// Data transformation utilities
export const transformToTimeSeriesData = (data: Array<{ date: string; value: number }>) => {
  return data.map(item => [new Date(item.date).getTime(), item.value]);
};

export const transformToCategoryData = (data: Array<{ category: string; value: number }>) => {
  return data.map(item => [item.category, item.value]);
};
