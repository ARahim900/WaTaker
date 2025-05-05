import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
  PieChart, Pie, Cell,
  Sankey, Tooltip as SankeyTooltip
} from 'recharts';
import Card from './ui/Card';
import KpiCard from './ui/KpiCard';
import { 
  getTotalL1Supply, 
  getTotalL2Volume, 
  getTotalL3Volume, 
  getStage1Loss, 
  getStage2Loss, 
  getTotalLoss, 
  getLossPercentages,
  getAllZonesLoss,
  getMultiPeriodData,
  getAvailablePeriods
} from '../utils/dataUtils';

const LossDetails = ({ waterData, selectedPeriod }) => {
  const [l1Supply, setL1Supply] = useState(0);
  const [l2Volume, setL2Volume] = useState(0);
  const [l3Volume, setL3Volume] = useState(0);
  const [stage1Loss, setStage1Loss] = useState(0);
  const [stage2Loss, setStage2Loss] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [lossPercentages, setLossPercentages] = useState({});
  const [zonesLoss, setZonesLoss] = useState([]);
  const [trendData, setTrendData] = useState([]);
  
  // Calculate loss metrics when data or period changes
  useEffect(() => {
    if (waterData && waterData.length && selectedPeriod) {
      // Calculate basic metrics
      const l1 = getTotalL1Supply(waterData, selectedPeriod);
      const l2 = getTotalL2Volume(waterData, selectedPeriod);
      const l3 = getTotalL3Volume(waterData, selectedPeriod);
      const s1Loss = getStage1Loss(waterData, selectedPeriod);
      const s2Loss = getStage2Loss(waterData, selectedPeriod);
      const totLoss = getTotalLoss(waterData, selectedPeriod);
      const percentages = getLossPercentages(waterData, selectedPeriod);
      
      setL1Supply(l1);
      setL2Volume(l2);
      setL3Volume(l3);
      setStage1Loss(s1Loss);
      setStage2Loss(s2Loss);
      setTotalLoss(totLoss);
      setLossPercentages(percentages);
      
      // Get zone loss data
      const zoneLosses = getAllZonesLoss(waterData, selectedPeriod);
      setZonesLoss(zoneLosses);
      
      // Get loss trend data (last 6 periods)
      const periods = getAvailablePeriods(waterData).slice(-6);
      const multiPeriodData = getMultiPeriodData(waterData, periods);
      setTrendData(multiPeriodData);
    }
  }, [waterData, selectedPeriod]);
  
  // Color schemes for charts
  const COLORS = ['#4338ca', '#0f766e', '#b91c1c', '#c2410c', '#a16207', '#15803d'];
  
  // Custom tooltips
  const ZoneLossTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{data.zone}</p>
          <p className="text-sm">{`Loss: ${data.lossValue.toLocaleString()} m³`}</p>
          <p className="text-sm">{`Loss Rate: ${data.lossPercentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Loss Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Loss KPI */}
          <KpiCard
            title="Total Loss (NRW)"
            value={lossPercentages.totalPercentage}
            unit="%"
            gradient={true}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 21l4-4m0 0l4-4m-4 4l-4-4m4 4l4 4"></path>
                <path d="M7 3l4 4m0 0l4-4m-4 4l-4-4m4 4l4 4"></path>
              </svg>
            }
          />
          
          {/* Stage 1 Loss KPI */}
          <KpiCard
            title="Stage 1 Loss"
            value={lossPercentages.stage1Percentage}
            unit="%"
            delay={1}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 18v-6"></path>
                <path d="M12 6h.01"></path>
              </svg>
            }
          />
          
          {/* Stage 2 Loss KPI */}
          <KpiCard
            title="Stage 2 Loss"
            value={lossPercentages.stage2Percentage}
            unit="%"
            delay={2}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4l3 3"></path>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              </svg>
            }
          />
        </div>
      </div>
      
      {/* Water Flow Diagram (Stage 1 and Stage 2 Losses) */}
      <Card title="Water Flow Analysis" delay={3}>
        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="p-3 bg-primary-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3m6-3v3M9 21H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                <circle cx="19" cy="18" r="3"></circle>
                <circle cx="12" cy="18" r="3"></circle>
              </svg>
            </div>
            <h3 className="mt-2 font-semibold text-gray-700">L1 Source</h3>
            <p className="text-2xl font-bold text-primary-600">{l1Supply.toLocaleString()} m³</p>
          </div>
          
          <div className="flex flex-col items-center relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400 rotate-90 md:rotate-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
            <div className="absolute top-10 md:top-auto md:-top-6 bg-red-100 rounded px-2 py-1">
              <span className="text-xs font-medium text-red-800">
                Stage 1 Loss: {stage1Loss.toLocaleString()} m³ ({lossPercentages.stage1Percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="p-3 bg-secondary-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-secondary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="mt-2 font-semibold text-gray-700">L2 Meters</h3>
            <p className="text-2xl font-bold text-secondary-600">{l2Volume.toLocaleString()} m³</p>
          </div>
          
          <div className="flex flex-col items-center relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400 rotate-90 md:rotate-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
            <div className="absolute top-10 md:top-auto md:-top-6 bg-red-100 rounded px-2 py-1">
              <span className="text-xs font-medium text-red-800">
                Stage 2 Loss: {stage2Loss.toLocaleString()} m³ ({lossPercentages.stage2Percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3m6-3v3M9 21H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                <circle cx="19" cy="18" r="3"></circle>
              </svg>
            </div>
            <h3 className="mt-2 font-semibold text-gray-700">L3 Endpoints</h3>
            <p className="text-2xl font-bold text-green-600">{l3Volume.toLocaleString()} m³</p>
          </div>
        </div>
        
        <div className="border-t mt-4 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total System Loss (NRW)</h4>
              <p className="text-lg font-bold text-gray-800">
                {totalLoss.toLocaleString()} m³ ({lossPercentages.totalPercentage.toFixed(1)}%)
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <h4 className="text-sm font-medium text-gray-500">System Efficiency</h4>
              <p className="text-lg font-bold text-gray-800">
                {(100 - lossPercentages.totalPercentage).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Trend Chart */}
        <Card title="Loss Trend Analysis" delay={4}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="stage1Percentage" 
                  name="Stage 1 Loss (%)" 
                  stroke="#4338ca" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="stage2Percentage" 
                  name="Stage 2 Loss (%)" 
                  stroke="#0f766e" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalPercentage" 
                  name="Total Loss (%)" 
                  stroke="#b91c1c" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Trend Analysis</h4>
            <p className="text-lg font-bold text-gray-800">
              {trendData.length} periods analyzed
            </p>
          </div>
        </Card>
        
        {/* Water Volume Trend Chart */}
        <Card title="Water Volume Trend" delay={5}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis unit="m³" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="l1Supply" 
                  name="L1 Supply (m³)" 
                  stroke="#4338ca" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="l2Volume" 
                  name="L2 Volume (m³)" 
                  stroke="#0f766e" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="l3Volume" 
                  name="L3 Consumption (m³)" 
                  stroke="#15803d" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Volume Analysis</h4>
            <p className="text-lg font-bold text-gray-800">
              Current Supply: {l1Supply.toLocaleString()} m³
            </p>
          </div>
        </Card>
      </div>
      
      {/* Internal Zone Loss Table */}
      <Card title="Internal Zone Loss Analysis" delay={6}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone Bulk (m³)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone Consumption (m³)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone Loss (m³)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loss Rate (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zonesLoss.map((zone, index) => {
                // Determine status based on loss percentage
                let status;
                let statusClass;
                
                if (zone.lossPercentage <= 10) {
                  status = "Good";
                  statusClass = "bg-green-100 text-green-800";
                } else if (zone.lossPercentage <= 20) {
                  status = "Moderate";
                  statusClass = "bg-yellow-100 text-yellow-800";
                } else {
                  status = "High";
                  statusClass = "bg-red-100 text-red-800";
                }
                
                // Find zone bulk meter
                const zoneBulkMeter = waterData.find(meter => 
                  meter.Label === 'L2' && 
                  meter['Meter Label'].toLowerCase().includes(zone.zone.toLowerCase())
                );
                
                const zoneBulkValue = zoneBulkMeter ? parseFloat(zoneBulkMeter[selectedPeriod]) || 0 : 0;
                const zoneConsumption = zoneBulkValue - zone.lossValue;
                
                return (
                  <tr key={zone.zone} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {zone.zone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zoneBulkValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zoneConsumption.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zone.lossValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zone.lossPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Zone Loss Chart */}
      <Card title="Zone Loss Comparison" delay={7}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={zonesLoss}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="zone" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" unit="m³" />
              <YAxis yAxisId="right" orientation="right" unit="%" />
              <Tooltip content={<ZoneLossTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="lossValue" 
                name="Loss (m³)" 
                fill="#4338ca" 
              />
              <Bar 
                yAxisId="right"
                dataKey="lossPercentage" 
                name="Loss Rate (%)" 
                fill="#b91c1c" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LossDetails;
