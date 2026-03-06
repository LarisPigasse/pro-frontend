// src/features/accounts/pages/components/AccountFilters.tsx

import React from 'react';
import { Select, Input } from '@/core/components/form';
import { Button } from '@/core/components/ui';
import { X } from 'lucide-react';
import type { AccountFilters as Filters, AccountType, AccountStatus, Role } from '../../types';

interface AccountFiltersProps {
  filters: Filters;
  roles: Role[]; // ← dinamici dall'hook
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const AccountFilters: React.FC<AccountFiltersProps> = ({ filters, roles, onChange, onReset }) => {
  const roleOptions = [
    { value: 'all', label: 'Tutti i ruoli' },
    ...roles.map(r => ({ value: r.id.toString(), label: r.name })),
  ];

  const accountTypeOptions: Array<{ value: AccountType | 'all'; label: string }> = [
    { value: 'all', label: 'Tutti i tipi' },
    { value: 'operatore', label: 'Operatore' },
    { value: 'partner', label: 'Partner' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'agente', label: 'Agente' },
  ];

  const statusOptions: Array<{ value: AccountStatus; label: string }> = [
    { value: 'all', label: 'Tutti gli stati' },
    { value: 'active', label: 'Attivi' },
    { value: 'inactive', label: 'Disattivati' },
    { value: 'blocked', label: 'Bloccati' },
  ];

  const hasActiveFilters =
    filters.search ||
    filters.roleId ||
    (filters.accountType && filters.accountType !== 'all') ||
    (filters.status && filters.status !== 'all');

  return (
    <div className='bg-white rounded-lg shadow p-6 mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Input
          label='Cerca email'
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          fullWidth
        />
        <Select
          label='Ruolo'
          value={filters.roleId ? filters.roleId.toString() : 'all'}
          onValueChange={value =>
            onChange({
              ...filters,
              roleId: value === 'all' ? undefined : parseInt(value, 10),
            })
          }
          options={roleOptions}
          fullWidth
        />
        <Select
          label='Tipo Account'
          value={filters.accountType || 'all'}
          onValueChange={value => onChange({ ...filters, accountType: value as AccountType | 'all' })}
          options={accountTypeOptions}
          fullWidth
        />
        <Select
          label='Stato'
          value={filters.status || 'all'}
          onValueChange={value => onChange({ ...filters, status: value as AccountStatus })}
          options={statusOptions}
          fullWidth
        />
      </div>
      {hasActiveFilters && (
        <div className='mt-4 flex justify-end'>
          <Button variant='ghost' size='sm' onClick={onReset}>
            <X className='w-4 h-4 mr-2' />
            Reset Filtri
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountFilters;
