import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
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
  getConsumptionByType,
  getAllZonesLoss
} from '../utils/dataUtils';

const Dashboard = ({ waterData, selectedPeriod }) => {
  if (!waterData || !waterData.length || !selectedPeriod) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No data available for display.</p>
      </div>
    );
  }
  
  // Calculate metrics
  const l1Supply = getTotalL1Supply(waterData, selectedPeriod);
  const l2Volume = getTotalL2Volume(waterData, selectedPeriod);
  const l3Volume = getTotalL3Volume(waterData, selectedPeriod);
  const stage1Loss = getStage1Loss(waterData, selectedPeriod);
  const stage2Loss = getStage2Loss(waterData, selectedPeriod);
  const totalLoss = getTotalLoss(waterData, selectedPeriod);
  const { 
    stage1Percentage, 
    stage2Percentage, 
    totalPercentage 
  } = getLossPercentages(waterData, selectedPeriod);
  
  // Get consumption by type
  const consumptionByType = getConsumptionByType(waterData, selectedPeriod);
  
  // Get top loss zones (limit to 5)
  const zonesLoss = getAllZonesLoss(waterData, selectedPeriod).slice(0, 5);
  
  // Fix colors for pie chart
  const COLORS = ['#4338ca', '#0f766e', '#b91c1c', '#c2410c', '#a16207', '#15803d'];
  
  // Custom tooltip for the consumption chart
  const ConsumptionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{data.type}</p>
          <p className="text-sm">{`Volume: ${data.value.toLocaleString()} m³`}</p>
          <p className="text-sm">{`${((data.value / l3Volume) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for the zone loss chart
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* L1 Supply KPI */}
          <KpiCard
            title="Total L1 Supply"
            value={l1Supply}
            unit="m³"
            delay={0}
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
                <path d="M12 2v6m0 0v14m0-14h6m-6 0H6"></path>
              </svg>
            }
          />
          
          {/* L2 Volume KPI */}
          <KpiCard
            title="Total L2 Volume"
            value={l2Volume}
            unit="m³"
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            }
          />
          
          {/* L3 Volume KPI */}
          <KpiCard
            title="Total L3 Consumption"
            value={l3Volume}
            unit="m³"
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
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            }
          />
          
          {/* Total Loss % KPI */}
          <KpiCard
            title="Total Loss (NRW)"
            value={totalPercentage}
            unit="%"
            delay={3}
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
          
          {/* Stage 1 Loss % KPI */}
          <KpiCard
            title="Stage 1 Loss"
            value={stage1Percentage}
            unit="%"
            delay={4}
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
          
          {/* Stage 2 Loss % KPI */}
          <KpiCard
            title="Stage 2 Loss"
            value={stage2Percentage}
            unit="%"
            delay={5}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption by Type Chart */}
        <Card title="Consumption Breakdown" delay={6}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consumptionByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="type"
                  label={({ type, percent }) => 
                    `${type}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {consumptionByType.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<ConsumptionTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Total Consumption</h4>
            <p className="text-lg font-bold text-gray-800">{l3Volume.toLocaleString()} m³</p>
          </div>
        </Card>
        
        {/* Top Loss Zones Chart */}
        <Card title="Top Loss Zones" delay={7}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zonesLoss}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis unit="%" />
                <Tooltip content={<ZoneLossTooltip />} />
                <Legend />
                <Bar 
                  dataKey="lossPercentage" 
                  name="Loss Rate (%)" 
                  fill="#4338ca" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Average Zone Loss</h4>
            <p className="text-lg font-bold text-gray-800">
              {zonesLoss.length > 0 
                ? (zonesLoss.reduce((sum, zone) => sum + zone.lossPercentage, 0) / zonesLoss.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Water Flow Diagram */}
        <Card title="Water Flow Analysis" delay={8}>
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
                  Stage 1 Loss: {stage1Loss.toLocaleString()} m³ ({stage1Percentage.toFixed(1)}%)
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
                  Stage 2 Loss: {stage2Loss.toLocaleString()} m³ ({stage2Percentage.toFixed(1)}%)
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
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total System Loss (NRW)</h4>
                <p className="text-lg font-bold text-gray-800">
                  {totalLoss.toLocaleString()} m³ ({totalPercentage.toFixed(1)}%)
                </p>
              </div>
              <button className="btn btn-primary text-sm">View Detailed Analysis</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
