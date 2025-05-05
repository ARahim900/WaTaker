# WaTaker

Water consumption analysis and loss tracking system for Muscat Bay.

## Overview

WaTaker is a modern web application designed to visualize and analyze water consumption and loss data from the Muscat Bay water distribution network. The system provides comprehensive insights into water usage patterns, identifies potential losses in the network, and helps in efficient water management.

## Features

- **Dashboard/Overview**: High-level summary of water consumption and losses
- **Zone Details**: In-depth analysis of individual zones
- **Type Details**: Consumption patterns based on usage type
- **Loss Details**: Focused view on water losses and their sources
- **Interactive Visualizations**: Dynamic charts and graphs for data visualization
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Technical Stack

- React.js
- Tailwind CSS
- Recharts for data visualization
- Framer Motion for animations

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Water System Hierarchy

The Muscat Bay water system follows a hierarchical distribution model:

1. **L1 (Source)**: Water enters the system from a main source, measured by the main bulk meter.
2. **L2 (Primary Distribution)**: Water is distributed to zones (Zone Bulk Meters) or directly to specific facilities (Direct Connection Meters).
3. **L3 (Final Consumption)**: End-user meters within zones.

## Loss Calculation Logic

- **Stage 1 Loss (Trunk Main Loss)**: L1 Supply - Total L2 Volume
- **Stage 2 Loss (Distribution Loss)**: Total L2 Volume - Total L3 Volume
- **Total Loss (NRW - Non-Revenue Water)**: L1 Supply - Total L3 Volume
- **Internal Zone Loss**: (Zone's L2 Bulk Meter Reading) - (Sum of readings for all L3 meters in that zone)
