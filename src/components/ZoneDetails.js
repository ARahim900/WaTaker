import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import Card from './ui/Card';
import KpiCard from './ui/KpiCard';
import { 
  getZones,
  getInternalZoneLoss,
  filterMeters,
  getMultiPeriodData,
  getConsumptionByType,
  getAvailablePeriods
} from '../utils/dataUtils';

const ZoneDetails = ({ waterData, selectedPeriod }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [zones, setZones] = useState([]);
  const [zoneMeters, setZoneMeters] = useState([]);
  const [zoneLoss, setZoneLoss] = useState({ value: 0, percentage: 0 });
  const [zoneBulkValue, setZoneBulkValue] = useState(0);
  const [zoneConsumption, setZoneConsumption] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  
  // Get available zones on component mount
  useEffect(() => {
    if (waterData && waterData.length) {
      const availableZones = getZones(waterData);
      setZones(availableZones);
      
      // Set default selected zone to the first zone in the list
      if (availableZones.length > 0 && !selectedZone) {
        setSelectedZone(availableZones[0]);
      }
    }
  }, [waterData, selectedZone]);
  
  // Update zone details when selected zone or period changes
  useEffect(() => {
    if (selectedZone && selectedPeriod && waterData && waterData.length) {
      // Get meters for this zone
      const metersInZone = filterMeters(waterData, { zone: selectedZone });
      setZoneMeters(metersInZone);
      
      // Get loss for this zone
      const loss = getInternalZoneLoss(waterData, selectedZone, selectedPeriod);
      setZoneLoss(loss);
      
      // Find zone bulk meter
      const zoneBulkMeter = waterData.find(meter => 
        meter.Label === 'L2' && 
        meter['Meter Label'].toLowerCase().includes(selectedZone.toLowerCase())
      );
      
      if (zoneBulkMeter) {
        setZoneBulkValue(parseFloat(zoneBulkMeter[selectedPeriod]) || 0);
      }
      
      // Get consumption breakdown by type for this zone
      const zoneFilteredData = filterMeters(waterData, { zone: selectedZone });
      const consumptionByType = getConsumptionByType(zoneFilteredData, selectedPeriod);
      setZoneConsumption(consumptionByType);
      
      // Get trend data for this zone (last 6 periods)
      const periods = getAvailablePeriods(waterData);
      const lastSixPeriods = periods.slice(-6);
      
      const trends = lastSixPeriods.map(period => {
        const zoneLoss = getInternalZoneLoss(waterData, selectedZone, period);
        const zoneConsumption = zoneFilteredData.reduce((sum, meter) => {
          if (meter.Label === 'L3') {
            return sum + (parseFloat(meter[period]) || 0);
          }
          return sum;
        }, 0);
        
        return {
          period,
          loss: zoneLoss.value,
          lossPercentage: zoneLoss.percentage,
          consumption: zoneConsumption
        };
      });
      
      setTrendsData(trends);
    }
  }, [selectedZone, selectedPeriod, waterData]);
  
  // Handle zone selection
  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };
  
  // Fix colors for pie chart
  const COLORS = ['#4338ca', '#0f766e', '#b91c1c', '#c2410c', '#a16207', '#15803d'];
  
  // Custom tooltip for the consumption chart
  const ConsumptionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalConsumption = zoneConsumption.reduce((sum, item) => sum + item.value, 0);
      
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{data.type}</p>
          <p className="text-sm">{`Volume: ${data.value.toLocaleString()} m³`}</p>
          <p className="text-sm">{`${((data.value / totalConsumption) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Zone Analysis</h2>
        
        <div className="w-64">
          <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Zone
          </label>
          <select
            id="zone-select"
            value={selectedZone}
            onChange={handleZoneChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Zone L2 Bulk KPI */}
        <KpiCard
          title={`${selectedZone} Bulk Supply`}
          value={zoneBulkValue}
          unit="m³"
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          }
        />
        
        {/* Zone L3 Consumption KPI */}
        <KpiCard
          title={`${selectedZone} Consumption`}
          value={zoneBulkValue - zoneLoss.value}
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
              <path d="M12 5c.67 0 1.35.09 2 .26V3a9 9 0 0 0-2 0v2.26zm-2 .26V3a9 9 0 0 0-2 .535v2.292a7.73 7.73 0 0 1 2-.567zM6 6.12V3.535A9 9 0 0 0 3.535 6h2.586zM3.535 8H6a7.73 7.73 0 0 1 .567 2H3.5A9 9 0 0 0 3.535 8zm0 10H6v-2.12A7.73 7.73 0 0 1 3.5 14a9 9 0 0 0 .035 2zm2.465 2.465A9 9 0 0 0 8 21.965V19.5a7.73 7.73 0 0 1-2-.568v2.033zm4 .535V19.74a7.73 7.73 0 0 1-2-.26v2.055a9 9 0 0 0 2 0zm4-2.033V19.5a7.73 7.73 0 0 1-2 .568v2.465a9 9 0 0 0 2-.568zm2.465-2.967A9 9 0 0 0 20.5 14a7.73 7.73 0 0 1-2.5 1.88v2.12zm0-10H18a7.73 7.73 0 0 1 .568-2h2.033A9 9 0 0 0 18 3.535V6zm-2.465-2.465A9 9 0 0 0 14 2.5v2.5a7.73 7.73 0 0 1 2 .568V3.535z"></path>
              <circle cx="12" cy="14" r="4"></circle>
            </svg>
          }
        />
        
        {/* Zone Loss KPI */}
        <KpiCard
          title={`${selectedZone} Loss`}
          value={zoneLoss.percentage}
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
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M16 13l-4 4-4-4"></path>
              <path d="M12 12v5"></path>
            </svg>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Consumption by Type */}
        <Card title={`${selectedZone} Consumption by Type`} delay={3}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zoneConsumption}
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
                  {zoneConsumption.map((entry, index) => (
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
            <h4 className="text-sm font-medium text-gray-500">Types of Usage</h4>
            <p className="text-lg font-bold text-gray-800">
              {zoneConsumption.length} different usage types
            </p>
          </div>
        </Card>
        
        {/* Zone Trend Chart */}
        <Card title={`${selectedZone} Trends`} delay={4}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" orientation="left" unit="m³" />
                <YAxis yAxisId="right" orientation="right" unit="%" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="consumption" 
                  name="Consumption (m³)" 
                  stroke="#4338ca" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="lossPercentage" 
                  name="Loss (%)" 
                  stroke="#b91c1c" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Trend Analysis</h4>
            <p className="text-lg font-bold text-gray-800">
              {trendsData.length} periods analyzed
            </p>
          </div>
        </Card>
      </div>
      
      {/* Meters Table */}
      <Card title={`${selectedZone} Meters (${zoneMeters.length})`} delay={5}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meter Label
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Meter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedPeriod} (m³)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zoneMeters.map((meter, index) => (
                <tr key={meter['Acct #']} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {meter['Meter Label']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meter['Acct #']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meter['Type']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meter['Parent Meter']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meter['Label']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {(parseFloat(meter[selectedPeriod]) || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ZoneDetails;
