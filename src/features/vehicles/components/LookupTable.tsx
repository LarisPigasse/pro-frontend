// =============================================================================
// VEHICLES MODULE — COMPONENT: LookupTable (generica, Configurazione)
// features/vehicles/components/LookupTable.tsx
// =============================================================================
//
// Tabella generica per le 6 lookup table di Configurazione. Ogni entità
// concreta (Workshop, VehicleCategory, ...) condivide solo id/isActive —
// quindi la genericità qui è sulle COLONNE (definite dal chiamante) e sulle
// 3 azioni standard (Modifica/Attiva-Disattiva/Elimina), che il backend
// garantisce presenti su tutte e 6 (stesso crudFactory, verificato).
//

import React from 'react';
import { Trash2, Power, PowerOff } from 'lucide-react';
import { Badge } from '@/core/components/ui';
import { Spinner } from '@/core/components/feedback';
import { Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';

export interface LookupColumn<T> {
  header: string;
  sortable?: boolean;
  sortKey?: keyof T;
  render: (item: T) => React.ReactNode;
}

interface LookupEntity {
  id: number;
  isActive: boolean;
}

interface LookupTableProps<T extends LookupEntity> {
  data: T[];
  columns: LookupColumn<T>[];
  loading: boolean;
  emptyMessage?: string;
  onEdit: (item: T) => void;
  onToggle: (item: T) => void;
  onDelete: (item: T) => void;
  deleteLabel?: string;
}

export function LookupTable<T extends LookupEntity>({
  data,
  columns,
  loading,
  emptyMessage = 'Nessun elemento trovato',
  onEdit,
  onToggle,
  onDelete,
  deleteLabel = 'Elimina',
}: LookupTableProps<T>) {
  const tableColumns: TableColumn<T>[] = [
    ...columns.map(col => ({
      header: col.header,
      sortable: col.sortable,
      accessor: (col.sortKey ?? 'id') as keyof T,
      render: col.render,
    })),
    {
      header: 'Stato',
      accessor: item => (
        <Badge variant={item.isActive ? 'success' : 'default'} size='sm'>
          {item.isActive ? 'Attivo' : 'Disattivo'}
        </Badge>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Spinner size='md' />
      </div>
    );
  }

  return (
    <Card variant='default' padding='none'>
      <Table
        data={data}
        columns={tableColumns}
        keyExtractor={item => item.id}
        isLoading={false}
        emptyMessage={emptyMessage}
        size='md'
        striped
        hoverable
        rowActions={{
          enabled: true,
          mode: 'menu',
          quickActions: {
            edit: { enabled: true, onEdit },
          },
          actions: item => [
            {
              id: 'toggle',
              label: item.isActive ? 'Disattiva' : 'Attiva',
              icon: item.isActive ? <PowerOff className='w-4 h-4' /> : <Power className='w-4 h-4' />,
              onClick: () => onToggle(item),
              divider: true,
            },
            {
              id: 'delete',
              label: deleteLabel,
              icon: <Trash2 className='w-4 h-4' />,
              onClick: () => onDelete(item),
              variant: 'danger' as const,
            },
          ],
        }}
      />
    </Card>
  );
}

export default LookupTable;
