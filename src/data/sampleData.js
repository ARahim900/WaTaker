// Sample data for development and testing
// In production, this would be loaded from an API or CSV file

export const sampleData = [
  // Main bulk meter (L1)
  {
    "Meter Label": "Main Bulk (NAMA)",
    "Acct #": "C43659",
    "Zone": "Main Bulk",
    "Type": "Main BULK",
    "Parent Meter": "NAMA",
    "Label": "L1",
    "Jan-25": "32580",
    "Feb-25": "44043",
    "Mar-25": "34915"
  },
  
  // Zone Bulk meters (L2)
  {
    "Meter Label": "ZONE 8 (Bulk Zone 8)",
    "Acct #": "4300342",
    "Zone": "Zone_08",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "1547",
    "Feb-25": "1498",
    "Mar-25": "2605"
  },
  {
    "Meter Label": "ZONE 3A (Bulk Zone 3A)",
    "Acct #": "4300343",
    "Zone": "Zone_03_(A)",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "4235",
    "Feb-25": "4273",
    "Mar-25": "3591"
  },
  {
    "Meter Label": "ZONE 3B (Bulk Zone 3B)",
    "Acct #": "4300344",
    "Zone": "Zone_03_(B)",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "3256",
    "Feb-25": "2962",
    "Mar-25": "3331"
  },
  {
    "Meter Label": "ZONE 5 (Bulk Zone 5)",
    "Acct #": "4300345",
    "Zone": "Zone_05",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "4267",
    "Feb-25": "4231",
    "Mar-25": "3862"
  },
  {
    "Meter Label": "ZONE FM ( BULK ZONE FM )",
    "Acct #": "4300346",
    "Zone": "Zone_01_(FM)",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "2008",
    "Feb-25": "1740",
    "Mar-25": "1880"
  },
  {
    "Meter Label": "Village Square (Zone Bulk)",
    "Acct #": "4300335",
    "Zone": "Zone_VS",
    "Type": "Zone Bulk",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "L2",
    "Jan-25": "14",
    "Feb-25": "12",
    "Mar-25": "21"
  },
  
  // Direct Connections (DC)
  {
    "Meter Label": "Hotel Main Building",
    "Acct #": "4300334",
    "Zone": "Direct Connection",
    "Type": "Retail",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "DC",
    "Jan-25": "18048",
    "Feb-25": "19482",
    "Mar-25": "22151"
  },
  {
    "Meter Label": "Irrigation- Controller DOWN",
    "Acct #": "4300341",
    "Zone": "Direct Connection",
    "Type": "IRR_Servies",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "DC",
    "Jan-25": "159",
    "Feb-25": "239",
    "Mar-25": "283"
  },
  {
    "Meter Label": "Al Adrak Construction",
    "Acct #": "4300347",
    "Zone": "Direct Connection",
    "Type": "Retail",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "DC",
    "Jan-25": "597",
    "Feb-25": "520",
    "Mar-25": "580"
  },
  {
    "Meter Label": "Al Adrak Camp",
    "Acct #": "4300348",
    "Zone": "Direct Connection",
    "Type": "Retail",
    "Parent Meter": "Main Bulk (NAMA)",
    "Label": "DC",
    "Jan-25": "1038",
    "Feb-25": "702",
    "Mar-25": "1161"
  },
  
  // Zone 8 L3 meters
  {
    "Meter Label": "Z8-12",
    "Acct #": "4300196",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "236",
    "Feb-25": "192",
    "Mar-25": "249"
  },
  {
    "Meter Label": "Z8-15",
    "Acct #": "4300198",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "99",
    "Feb-25": "61",
    "Mar-25": "70"
  },
  {
    "Meter Label": "Z8-16",
    "Acct #": "4300199",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "67",
    "Feb-25": "72",
    "Mar-25": "54"
  },
  {
    "Meter Label": "Z8-17",
    "Acct #": "4300200",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "164",
    "Feb-25": "162",
    "Mar-25": "171"
  },
  {
    "Meter Label": "Z8-5",
    "Acct #": "4300287",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "208",
    "Feb-25": "341",
    "Mar-25": "313"
  },
  {
    "Meter Label": "Z8-18",
    "Acct #": "4300289",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "122",
    "Feb-25": "111",
    "Mar-25": "336"
  },
  {
    "Meter Label": "Z8-19",
    "Acct #": "4300290",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "104",
    "Feb-25": "87",
    "Mar-25": "231"
  },
  {
    "Meter Label": "Z8-20",
    "Acct #": "4300291",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "146",
    "Feb-25": "110",
    "Mar-25": "312"
  },
  {
    "Meter Label": "Z8-21",
    "Acct #": "4300292",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "99",
    "Feb-25": "72",
    "Mar-25": "276"
  },
  {
    "Meter Label": "Z8-22",
    "Acct #": "4300293",
    "Zone": "Zone_08",
    "Type": "Residential (Villa)",
    "Parent Meter": "BULK ZONE 8",
    "Label": "L3",
    "Jan-25": "225",
    "Feb-25": "156",
    "Mar-25": "336"
  },
  
  // Anomalous meter to be excluded
  {
    "Meter Label": "Z3-74(3) (Building)",
    "Acct #": "4300322",
    "Zone": "Zone_03_(A)",
    "Type": "Residential (Apart)",
    "Parent Meter": "D-74 Building Bulk Meter",
    "Label": "L3",
    "Jan-25": "0",
    "Feb-25": "0",
    "Mar-25": "0"
  },
  
  // Zone 3A meters (sample)
  {
    "Meter Label": "Z3-35 (Villa)",
    "Acct #": "4300075",
    "Zone": "Zone_03_(A)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3A (BULK ZONE 3A)",
    "Label": "L3",
    "Jan-25": "65",
    "Feb-25": "61",
    "Mar-25": "52"
  },
  {
    "Meter Label": "Z3-43 (Villa)",
    "Acct #": "4300050",
    "Zone": "Zone_03_(A)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3A (BULK ZONE 3A)",
    "Label": "L3",
    "Jan-25": "70",
    "Feb-25": "68",
    "Mar-25": "46"
  },
  {
    "Meter Label": "Z3-31 (Villa)",
    "Acct #": "4300052",
    "Zone": "Zone_03_(A)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3A (BULK ZONE 3A)",
    "Label": "L3",
    "Jan-25": "165",
    "Feb-25": "133",
    "Mar-25": "30"
  },
  {
    "Meter Label": "Z3-36 (Villa)",
    "Acct #": "4300084",
    "Zone": "Zone_03_(A)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3A (BULK ZONE 3A)",
    "Label": "L3",
    "Jan-25": "81",
    "Feb-25": "83",
    "Mar-25": "69"
  },
  {
    "Meter Label": "D 45-Building Common Meter",
    "Acct #": "4300135",
    "Zone": "Zone_03_(A)",
    "Type": "D_Building_Common",
    "Parent Meter": "D-45 Building Bulk Meter",
    "Label": "L3",
    "Jan-25": "0",
    "Feb-25": "1",
    "Mar-25": "1"
  },
  
  // Zone 3B meters (sample)
  {
    "Meter Label": "Z3-15 (Villa)",
    "Acct #": "4300057",
    "Zone": "Zone_03_(B)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3B (BULK ZONE 3B)",
    "Label": "L3",
    "Jan-25": "40",
    "Feb-25": "41",
    "Mar-25": "35"
  },
  {
    "Meter Label": "Z3-3 (Villa)",
    "Acct #": "4300088",
    "Zone": "Zone_03_(B)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3B (BULK ZONE 3B)",
    "Label": "L3",
    "Jan-25": "66",
    "Feb-25": "59",
    "Mar-25": "63"
  },
  {
    "Meter Label": "Z3-5 (Villa)",
    "Acct #": "4300104",
    "Zone": "Zone_03_(B)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3B (BULK ZONE 3B)",
    "Label": "L3",
    "Jan-25": "40",
    "Feb-25": "51",
    "Mar-25": "42"
  },
  {
    "Meter Label": "Z3-8 (Villa)",
    "Acct #": "4300105",
    "Zone": "Zone_03_(B)",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 3B (BULK ZONE 3B)",
    "Label": "L3",
    "Jan-25": "83",
    "Feb-25": "106",
    "Mar-25": "196"
  },
  
  // Zone 5 meters (sample)
  {
    "Meter Label": "Z5-13",
    "Acct #": "4300058",
    "Zone": "Zone_05",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 5 (Bulk Zone 5)",
    "Label": "L3",
    "Jan-25": "72",
    "Feb-25": "106",
    "Mar-25": "89"
  },
  {
    "Meter Label": "Z5-14",
    "Acct #": "4300059",
    "Zone": "Zone_05",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 5 (Bulk Zone 5)",
    "Label": "L3",
    "Jan-25": "71",
    "Feb-25": "93",
    "Mar-25": "77"
  },
  {
    "Meter Label": "Z5-4",
    "Acct #": "4300150",
    "Zone": "Zone_05",
    "Type": "Residential (Villa)",
    "Parent Meter": "ZONE 5 (Bulk Zone 5)",
    "Label": "L3",
    "Jan-25": "81",
    "Feb-25": "98",
    "Mar-25": "35"
  },
  
  // Zone FM meters (sample)
  {
    "Meter Label": "Building B1",
    "Acct #": "4300300",
    "Zone": "Zone_01_(FM)",
    "Type": "Retail",
    "Parent Meter": "ZONE FM ( BULK ZONE FM )",
    "Label": "L3",
    "Jan-25": "228",
    "Feb-25": "225",
    "Mar-25": "235"
  },
  {
    "Meter Label": "Building B2",
    "Acct #": "4300301",
    "Zone": "Zone_01_(FM)",
    "Type": "Retail",
    "Parent Meter": "ZONE FM ( BULK ZONE FM )",
    "Label": "L3",
    "Jan-25": "236",
    "Feb-25": "213",
    "Mar-25": "202"
  },
  {
    "Meter Label": "Building B8",
    "Acct #": "4300307",
    "Zone": "Zone_01_(FM)",
    "Type": "Retail",
    "Parent Meter": "ZONE FM ( BULK ZONE FM )",
    "Label": "L3",
    "Jan-25": "268",
    "Feb-25": "250",
    "Mar-25": "233"
  },
  {
    "Meter Label": "Building CIF/CB",
    "Acct #": "4300324",
    "Zone": "Zone_01_(FM)",
    "Type": "Retail",
    "Parent Meter": "ZONE FM ( BULK ZONE FM )",
    "Label": "L3",
    "Jan-25": "420",
    "Feb-25": "331",
    "Mar-25": "306"
  },
  
  // Village Square meters
  {
    "Meter Label": "Laundry Services (FF Shop No.593)",
    "Acct #": "4300332",
    "Zone": "Zone_VS",
    "Type": "Retail",
    "Parent Meter": "Village Square (Zone Bulk)",
    "Label": "L3",
    "Jan-25": "33",
    "Feb-25": "25",
    "Mar-25": "22"
  }
];
