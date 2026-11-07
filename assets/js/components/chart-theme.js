/**
 * PHARMA LINK — Chart.js global theme (premium SaaS defaults)
 */
window.PharmaCharts = (function () {
  const palette = ['#0879D8', '#073C78', '#12BFC0', '#d97706', '#64748b', '#16A36A'];

  function applyDefaults() {
    if (!window.Chart) return;
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--pl-font').trim() || 'IBM Plex Sans Arabic, Inter, sans-serif';
    Chart.defaults.font.family = fontFamily;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#5a6b85';
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.boxHeight = 10;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
    Chart.defaults.plugins.tooltip.backgroundColor = '#073C78';
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.elements.line.tension = 0.35;
    Chart.defaults.elements.line.borderWidth = 2;
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hoverRadius = 4;
    Chart.defaults.elements.bar.borderRadius = 4;
    Chart.defaults.elements.bar.borderSkipped = false;
    Chart.defaults.scale.grid = { color: '#e8eef6', drawBorder: false };
    Chart.defaults.scale.ticks = { color: '#8b9bb3', padding: 6 };
  }

  function colors(n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(palette[i % palette.length]);
    return out;
  }

  function softFill(hex, alpha) {
    const a = alpha == null ? 0.12 : alpha;
    // hex #rrggbb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  applyDefaults();

  return { applyDefaults: applyDefaults, palette: palette, colors: colors, softFill: softFill };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    if (window.PharmaCharts) PharmaCharts.applyDefaults();
  });
} else if (window.PharmaCharts) {
  PharmaCharts.applyDefaults();
}
