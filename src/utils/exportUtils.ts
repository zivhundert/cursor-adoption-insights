
import html2canvas from 'html2canvas';

export const exportToImage = async () => {
  const element = document.querySelector('[data-export="dashboard-main"]') as HTMLElement;
  if (!element) {
    throw new Error('Dashboard element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  const link = document.createElement('a');
  link.download = `ai-intelligence-dashboard-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
