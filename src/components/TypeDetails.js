import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Card from './ui/Card';
import KpiCard from './ui/KpiCard';
import { 
  getTypes,
  filterMeters,
  getZones,
  getAvailablePeriods,
  getConsumptionByType
} from '../utils/dataUtils';

const TypeDetails = ({ waterData, selectedPeriod }) => {
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [typeMeters, setTypeMeters] = useState([]);
  const [typeTotalConsumption, setTypeTotalConsumption] = useState(0);
  const [typeZoneBreakdown, setTypeZoneBreakdown] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  
  // Get available types on component mount
  useEffect(() => {
    if (waterData && waterData.length) {
      const availableTypes = getTypes(waterData);
      setTypes(availableTypes);
      
      // Set default selected type to the first type in the list
      if (availableTypes.length > 0 && !selectedType) {
        setSelectedType(availableTypes[0]);
      }
    }
  }, [waterData, selectedType]);
  
  // Update type details when selected type or period changes
  useEffect(() => {
    if (selectedType && selectedPeriod && waterData && waterData.length) {
      // Get meters for this type
      const metersOfType = filterMeters(waterData, { type: selectedType });
      setTypeMeters(metersOfType);
      
      // Calculate total consumption for this type
      const totalConsumption = metersOfType.reduce((sum, meter) => {
        if (meter.Label === 'L3' || meter.Label === 'DC') {
          return sum + (parseFloat(meter[selectedPeriod]) || 0);
        }
        return sum;
      }, 0);
      
      setTypeTotalConsumption(totalConsumption);
      
      // Calculate consumption per zone
      const zones = getZones(waterData);
      const zoneBreakdown = zones.map(zone => {
        const zoneMeters = metersOfType.filter(meter => meter.Zone === zone);
        const zoneConsumption = zoneMeters.reduce((sum, meter) => {
          if (meter.Label === 'L3' || meter.Label === 'DC') {
            return sum + (parseFloat(meter[selectedPeriod]) || 0);
          }
          return sum;
        }, 0);
        
        return {
          zone,
          value: zoneConsumption,
          percentage: totalConsumption > 0 ? (zoneConsumption / totalConsumption) * 100 : 0
        };
      }).filter(item => item.value > 0) // Remove zones with zero consumption
        .sort((a, b) => b.value - a.value); // Sort by highest consumption first
      
      setTypeZoneBreakdown(zoneBreakdown);
      
      // Get trend data for this type (last 6 periods)
      const periods = getAvailablePeriods(waterData);
      const lastSixPeriods = periods.slice(-6);
      
      const trends = lastSixPeriods.map(period => {
        const periodConsumption = metersOfType.reduce((sum, meter) => {
          if (meter.Label === 'L3' || meter.Label === 'DC') {
            return sum + (parseFloat(meter[period]) || 0);
          }
          return sum;
        }, 0);
        
        // Also get total consumption for comparison
        const allConsumptionMeters = waterData.filter(meter => meter.Label === 'L3' || meter.Label === 'DC');
        const totalAllConsumption = allConsumptionMeters.reduce((sum, meter) => {
          return sum + (parseFloat(meter[period]) || 0);
        }, 0);
        
        return {
          period,
          consumption: periodConsumption,
          percentage: totalAllConsumption > 0 ? (periodConsumption / totalAllConsumption) * 100 : 0
        };
      });
      
      setTrendsData(trends);
    }
  }, [selectedType, selectedPeriod, waterData]);
  
  // Handle type selection
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };
  
  // Fix colors for charts
  const COLORS = ['#4338ca', '#0f766e', '#b91c1c', '#c2410c', '#a16207', '#15803d', '#7e22ce', '#be185d'];
  
  // Custom tooltip for the zone breakdown chart
  const ZoneBreakdownTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{data.zone}</p>
          <p className="text-sm">{`Volume: ${data.value.toLocaleString()} m³`}</p>
          <p className="text-sm">{`${data.percentage.toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Type Analysis</h2>
        
        <div className="w-64">
          <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Usage Type
          </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={handleTypeChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Total Consumption KPI */}
        <KpiCard
          title={`${selectedType} Consumption`}
          value={typeTotalConsumption}
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          }
        />
        
        {/* Type Number of Meters KPI */}
        <KpiCard
          title={`${selectedType} Meters`}
          value={typeMeters.filter(meter => meter.Label === 'L3' || meter.Label === 'DC').length}
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          }
        />
        
        {/* Type Zones Count KPI */}
        <KpiCard
          title={`Zones with ${selectedType}`}
          value={typeZoneBreakdown.length}
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
              <path d="M21 3H3l9 9"></path>
              <path d="M18 13 A6 6 0 0 1 12 19 A6 6 0 0 1 6 13 A6 6 0 0 1 18 13"></path>
            </svg>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Consumption by Zone */}
        <Card title={`${selectedType} Consumption by Zone`} delay={3}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeZoneBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="zone"
                  label={({ zone, percent }) => 
                    `${zone}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {typeZoneBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<ZoneBreakdownTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Zone Distribution</h4>
            <p className="text-lg font-bold text-gray-800">
              {typeZoneBreakdown.length} zones with {selectedType}
            </p>
          </div>
        </Card>
        
        {/* Type Trend Chart */}
        <Card title={`${selectedType} Consumption Trend`} delay={4}>
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
                  dataKey="percentage" 
                  name="% of Total Consumption" 
                  stroke="#0f766e" 
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
      
      {/* Zone Distribution Bar Chart */}
      <Card title={`${selectedType} Zone Distribution`} delay={5}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={typeZoneBreakdown}
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
              <YAxis unit="m³" />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="value" 
                name={`${selectedType} Consumption (m³)`} 
                fill="#4338ca" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Meters Table */}
      <Card title={`${selectedType} Meters (${typeMeters.filter(meter => meter.Label === 'L3' || meter.Label === 'DC').length})`} delay={6}>
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
                  Zone
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
              {typeMeters
                .filter(meter => meter.Label === 'L3' || meter.Label === 'DC')
                .sort((a, b) => parseFloat(b[selectedPeriod]) - parseFloat(a[selectedPeriod]))
                .map((meter, index) => (
                  <tr key={meter['Acct #']} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {meter['Meter Label']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {meter['Acct #']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {meter['Zone']}
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

export default TypeDetails;
