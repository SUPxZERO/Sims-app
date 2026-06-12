import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | string | ((row: any) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: any) => string | number;
  emptyMessage?: string;
}

export function Table<T>({ data, columns, keyExtractor, emptyMessage = 'No data available' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/20">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-800/30 transition-colors duration-200 stagger-item" style={{ animationDelay: `${index * 30}ms` }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-slate-300 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : ((row as any)[col.accessor as string] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
