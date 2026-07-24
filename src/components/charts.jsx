import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext.jsx';

/*
 * Thin wrappers around react-apexcharts (replacing ng-apexcharts).
 * They read the current theme so charts adapt to dark/light mode.
 */
function useChartBase() {
  const { darkMode } = useTheme();
  return {
    mode: darkMode ? 'dark' : 'light',
    fg: darkMode ? '#e5e7eb' : '#334155',
    grid: darkMode ? '#334155' : '#eef2f7',
    tooltipTheme: 'light',
  };
}

export function DonutChart({ series, labels, colors, height = 240 }) {
  const base = useChartBase();
  const options = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: base.mode },
    labels,
    colors,
    legend: { position: 'bottom', labels: { colors: base.fg } },
    dataLabels: { enabled: true },
    stroke: { width: 0 },
    plotOptions: { pie: { donut: { size: '65%' } } },
    tooltip: { theme: base.tooltipTheme },
  };
  return <Chart type="donut" series={series} options={options} height={height} />;
}

export function RadialChart({ value, label, color = '#10b981', height = 240 }) {
  const base = useChartBase();
  const options = {
    chart: { type: 'radialBar', background: 'transparent' },
    theme: { mode: base.mode },
    colors: [color],
    plotOptions: {
      radialBar: {
        hollow: { size: '62%' },
        dataLabels: {
          name: { color: base.fg, fontSize: '13px' },
          value: { color: base.fg, fontSize: '26px', fontWeight: 700 },
        },
      },
    },
    labels: [label],
  };
  return <Chart type="radialBar" series={[value]} options={options} height={height} />;
}

export function LineChart({ series, categories, colors, height = 260 }) {
  const base = useChartBase();
  const options = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false } },
    theme: { mode: base.mode },
    colors,
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 4 },
    grid: { borderColor: base.grid },
    xaxis: { categories, labels: { style: { colors: base.fg } } },
    yaxis: { labels: { style: { colors: base.fg } } },
    legend: { labels: { colors: base.fg } },
    tooltip: { theme: base.tooltipTheme },
  };
  return <Chart type="line" series={series} options={options} height={height} />;
}

export function BarChart({ series, categories, colors, horizontal = false, height = 260 }) {
  const base = useChartBase();
  const options = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: base.mode },
    colors,
    plotOptions: { bar: { horizontal, borderRadius: 5, columnWidth: '55%', distributed: !!colors && colors.length > 1 } },
    dataLabels: { enabled: false },
    grid: { borderColor: base.grid },
    xaxis: { categories, labels: { style: { colors: base.fg } } },
    yaxis: { labels: { style: { colors: base.fg } } },
    legend: { show: false },
    tooltip: { theme: base.tooltipTheme },
  };
  return <Chart type="bar" series={series} options={options} height={height} />;
}
