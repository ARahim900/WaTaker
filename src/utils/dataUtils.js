import _ from 'lodash';

// Data processing and analysis functions for water consumption data

// Extract all available periods (months) from the data
export const getAvailablePeriods = (data) => {
  if (!data || !data.length) return [];
  
  // Get the first meter to extract column names
  const firstMeter = data[0];
  
  // Filter out non-date columns and extract periods
  const periods = Object.keys(firstMeter).filter(key => 
    key !== 'Meter Label' && 
    key !== 'Acct #' && 
    key !== 'Zone' && 
    key !== 'Type' && 
    key !== 'Parent Meter' && 
    key !== 'Label'
  );
  
  return periods;
};

// Get all unique zones
export const getZones = (data) => {
  if (!data || !data.length) return [];
  return _.uniq(data.map(meter => meter.Zone)).filter(Boolean).sort();
};

// Get all unique types
export const getTypes = (data) => {
  if (!data || !data.length) return [];
  return _.uniq(data.map(meter => meter.Type)).filter(Boolean).sort();
};

// Filter meters by specific criteria
export const filterMeters = (data, { zone, type, label }) => {
  if (!data || !data.length) return [];
  
  return data.filter(meter => {
    const zoneMatch = !zone || meter.Zone === zone;
    const typeMatch = !type || meter.Type === type;
    const labelMatch = !label || meter.Label === label;
    
    return zoneMatch && typeMatch && labelMatch;
  });
};

// Calculate total L1 supply for a specific period
export const getTotalL1Supply = (data, period) => {
  if (!data || !data.length) return 0;
  
  const l1Meters = data.filter(meter => meter.Label === 'L1');
  if (!l1Meters.length) return 0;
  
  return l1Meters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
};

// Calculate total L2 volume for a specific period
export const getTotalL2Volume = (data, period) => {
  if (!data || !data.length) return 0;
  
  // Find L1 meter to get its meter label for comparison
  const l1Meter = data.find(meter => meter.Label === 'L1');
  const l1MeterLabel = l1Meter ? l1Meter['Meter Label'] : '';
  
  // Sum all L2 meters
  const l2Meters = data.filter(meter => meter.Label === 'L2');
  const l2Sum = l2Meters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
  
  // Sum all DC meters that are directly connected to the main bulk
  const dcMeters = data.filter(meter => 
    meter.Label === 'DC' && 
    meter['Parent Meter'] === l1MeterLabel
  );
  const dcSum = dcMeters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
  
  return l2Sum + dcSum;
};

// Calculate total L3 volume (final consumption) for a specific period
export const getTotalL3Volume = (data, period) => {
  if (!data || !data.length) return 0;
  
  // Exclude the anomalous meter with Acct # 4300322
  const validMeters = data.filter(meter => meter['Acct #'] !== '4300322');
  
  // Sum all L3 meters
  const l3Meters = validMeters.filter(meter => meter.Label === 'L3');
  const l3Sum = l3Meters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
  
  // Sum all DC meters
  const dcMeters = validMeters.filter(meter => meter.Label === 'DC');
  const dcSum = dcMeters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
  
  return l3Sum + dcSum;
};

// Calculate Stage 1 Loss (Trunk Main Loss) for a specific period
export const getStage1Loss = (data, period) => {
  const l1Supply = getTotalL1Supply(data, period);
  const l2Volume = getTotalL2Volume(data, period);
  
  return Math.max(0, l1Supply - l2Volume); // Ensure we don't return negative values
};

// Calculate Stage 2 Loss (Distribution Loss) for a specific period
export const getStage2Loss = (data, period) => {
  const l2Volume = getTotalL2Volume(data, period);
  const l3Volume = getTotalL3Volume(data, period);
  
  return Math.max(0, l2Volume - l3Volume); // Ensure we don't return negative values
};

// Calculate Total Loss (NRW - Non-Revenue Water) for a specific period
export const getTotalLoss = (data, period) => {
  const l1Supply = getTotalL1Supply(data, period);
  const l3Volume = getTotalL3Volume(data, period);
  
  return Math.max(0, l1Supply - l3Volume); // Ensure we don't return negative values
};

// Calculate loss percentages
export const getLossPercentages = (data, period) => {
  const l1Supply = getTotalL1Supply(data, period);
  const l2Volume = getTotalL2Volume(data, period);
  const stage1Loss = getStage1Loss(data, period);
  const stage2Loss = getStage2Loss(data, period);
  const totalLoss = getTotalLoss(data, period);
  
  return {
    stage1Percentage: l1Supply > 0 ? (stage1Loss / l1Supply) * 100 : 0,
    stage2Percentage: l2Volume > 0 ? (stage2Loss / l2Volume) * 100 : 0,
    totalPercentage: l1Supply > 0 ? (totalLoss / l1Supply) * 100 : 0
  };
};

// Calculate internal zone loss for a specific zone and period
export const getInternalZoneLoss = (data, zone, period) => {
  if (!data || !data.length || !zone) return { value: 0, percentage: 0 };
  
  // Find the L2 bulk meter for this zone
  const zoneBulkMeter = data.find(meter => 
    meter.Label === 'L2' && 
    meter['Meter Label'].toLowerCase().includes(zone.toLowerCase())
  );
  
  if (!zoneBulkMeter) return { value: 0, percentage: 0 };
  
  const zoneBulkValue = parseFloat(zoneBulkMeter[period]) || 0;
  
  // Exclude the anomalous meter
  const validMeters = data.filter(meter => meter['Acct #'] !== '4300322');
  
  // Sum all L3 meters in this zone
  const zoneL3Meters = validMeters.filter(meter => 
    meter.Label === 'L3' && 
    meter.Zone === zone
  );
  
  const zoneL3Sum = zoneL3Meters.reduce((sum, meter) => sum + (parseFloat(meter[period]) || 0), 0);
  
  const lossValue = Math.max(0, zoneBulkValue - zoneL3Sum);
  const lossPercentage = zoneBulkValue > 0 ? (lossValue / zoneBulkValue) * 100 : 0;
  
  return {
    value: lossValue,
    percentage: lossPercentage
  };
};

// Calculate loss for all zones in a specific period
export const getAllZonesLoss = (data, period) => {
  const zones = getZones(data);
  
  return zones.map(zone => {
    const loss = getInternalZoneLoss(data, zone, period);
    return {
      zone,
      lossValue: loss.value,
      lossPercentage: loss.percentage
    };
  }).sort((a, b) => b.lossPercentage - a.lossPercentage); // Sort by highest percentage first
};

// Get consumption breakdown by type for a specific period
export const getConsumptionByType = (data, period) => {
  if (!data || !data.length) return [];
  
  // Exclude the anomalous meter
  const validMeters = data.filter(meter => meter['Acct #'] !== '4300322');
  
  // Filter L3 and DC meters
  const consumptionMeters = validMeters.filter(meter => 
    meter.Label === 'L3' || meter.Label === 'DC'
  );
  
  // Group by type and sum consumption
  const typesConsumption = _.groupBy(consumptionMeters, 'Type');
  
  return Object.entries(typesConsumption).map(([type, meters]) => {
    const consumptionValue = meters.reduce((sum, meter) => 
      sum + (parseFloat(meter[period]) || 0), 0
    );
    
    return {
      type,
      value: consumptionValue
    };
  }).filter(item => item.value > 0) // Remove zero consumption
    .sort((a, b) => b.value - a.value); // Sort by highest consumption first
};

// Get data for multiple periods for trend analysis
export const getMultiPeriodData = (data, periods) => {
  if (!data || !data.length || !periods || !periods.length) return [];
  
  return periods.map(period => {
    const l1Supply = getTotalL1Supply(data, period);
    const l2Volume = getTotalL2Volume(data, period);
    const l3Volume = getTotalL3Volume(data, period);
    const stage1Loss = getStage1Loss(data, period);
    const stage2Loss = getStage2Loss(data, period);
    const totalLoss = getTotalLoss(data, period);
    const { 
      stage1Percentage, 
      stage2Percentage, 
      totalPercentage 
    } = getLossPercentages(data, period);
    
    return {
      period,
      l1Supply,
      l2Volume,
      l3Volume,
      stage1Loss,
      stage2Loss,
      totalLoss,
      stage1Percentage,
      stage2Percentage,
      totalPercentage
    };
  });
};

// Parse CSV data into structured format
export const parseCSVData = (csvText) => {
  // This is a simple implementation - in a real app you'd use a library like PapaParse
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const obj = {};
    
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }
    
    data.push(obj);
  }
  
  return data;
};
