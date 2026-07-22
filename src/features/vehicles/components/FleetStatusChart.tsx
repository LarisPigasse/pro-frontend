// =============================================================================
// ASSET AZIENDALI — COMPONENT: FleetStatusChart
// features/vehicles/components/FleetStatusChart.tsx
// =============================================================================

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/core/components/layout';
import { Skeleton } from '@/core/components/feedback';
import { VEHICLE_STATUS_LABELS } from '../types/vehicles.types';
import type { VehicleStatus } from '../types/vehicles.types';
import type { VehicleStatusBreakdown } from '../types/dashboard.types';

/** Stessa famiglia semantica delle Badge usate in Dotazione (success/warning/default/danger) */
const STATUS_COLORS: Record<VehicleStatus, string> = {
  active: '#10b981',
  maintenance: '#f59e0b',
  inactive: '#9ca3af',
  decommissioned: '#ef4444',
};

interface FleetStatusChartProps {
  breakdown: VehicleStatusBreakdown;
  loading?: boolean;
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({ breakdown, loading }) => {
  const data = (Object.keys(breakdown) as VehicleStatus[])
    .map(status => ({ status, label: VEHICLE_STATUS_LABELS[status], value: breakdown[status] }))
    .filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card variant='default' padding='md'>
      <h2 className='text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3'>Distribuzione flotta</h2>

      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <Skeleton className='h-48 w-48 rounded-full' />
        </div>
      ) : total === 0 ? (
        <div className='flex items-center justify-center h-64'>
          <p className='text-sm text-text-secondary'>Nessun veicolo in flotta</p>
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={260}>
          <PieChart>
            <Pie data={data} dataKey='value' nameKey='label' innerRadius={60} outerRadius={90} paddingAngle={2}>
              {data.map(d => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} veicoli`, name]} />
            <Legend verticalAlign='bottom' height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default FleetStatusChart;
