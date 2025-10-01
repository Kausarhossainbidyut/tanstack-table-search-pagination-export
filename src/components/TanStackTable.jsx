import { createColumnHelper, flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadBtn from './DownloadBtn';
import DebouncedInput from './DebouncedInput';

const TanStackTable = () => {
    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("id", {
            id: "S.No",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("avatar", {
            cell: (info) => (
                <img src={info.getValue()} alt="profile" className='rounded-full w-10 h-10 object-cover' />
            ),
            header: "Profile",
        }),
        columnHelper.accessor("user", {
            cell: (info) => <span className='font-medium text-gray-800'>{info.getValue()}</span>,
            header: "User",
        }),
        columnHelper.accessor("email", {
            cell: (info) => <span className='text-gray-600'>{info.getValue()}</span>,
            header: "Email",
        }),
        columnHelper.accessor("role", {
            cell: (info) => <span className='capitalize text-gray-700'>{info.getValue()}</span>,
            header: "Role",
        }),
        columnHelper.accessor("status", {
            cell: (info) => {
                const status = info.getValue();
                const color = status === 'active' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-400' : 'bg-red-500';
                return (
                    <div className='flex items-center gap-2'>
                        <span className={`w-3 h-3 rounded-full ${color}`}></span>
                        <span className='capitalize text-gray-700'>{status}</span>
                    </div>
                );
            },
            header: "Status",
        }),
        columnHelper.accessor("joinDate", {
            cell: (info) => <span className='text-gray-600'>{info.getValue()}</span>,
            header: "Join Date",
        }),
    ];

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/user.json")
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className='p-4 max-w-6xl mx-auto bg-white shadow-md rounded'>
            <div className='flex flex-col md:flex-row justify-between mb-4 gap-2'>

                <div>
                    <DebouncedInput
                        value={globalFilter}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder="Search all columns..."
                        className="py-2 bg-transparent outline-none border-b-2 w-8/12 focus:w-11/12 duration-300 border-indigo-500"
                    />
                </div>
                <DownloadBtn data={data} user={"user"} />
            </div>

            <table className='min-w-full border border-gray-200 text-left'>
                <thead className='bg-indigo-100'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='px-4 py-2 text-gray-800 font-medium'>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                        <tr key={row.id} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-indigo-50 transition`}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='px-4 py-2 text-gray-700'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='flex flex-wrap items-center justify-end gap-2 mt-4'>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className='px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50'
                >
                    {"<"}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50'
                >
                    {">"}
                </button>
                <span className='text-gray-700'>
                    Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
                </span>
                <span className='flex items-center gap-1 text-gray-700'>
                    Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="w-16 p-1 border rounded text-gray-700"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    className='p-2 border rounded text-gray-700'
                >
                    {[10, 20, 30, 40, 50].map(size => (
                        <option key={size} value={size}>Show {size}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TanStackTable;
