"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosinstance";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  // add other fields if needed
};

const OrdersTable: React.FC = () => {
  const router = useRouter();

  // 1) Fetch orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/order/api/get-user-orders");
      return res.data.orders as Order[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2) Define columns
  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ getValue }) => (
          <span>#{(getValue() as string).slice(-6).toUpperCase()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
      },
      {
        accessorKey: "total",
        header: "Total ($)",
        cell: ({ getValue }) => (
          <span>${(getValue() as number).toFixed(2)}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return <span>{date.toLocaleDateString()}</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/order/${row.original.id}`)}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Track Order <ArrowUpRight size={14} />
          </button>
        ),
      },
    ],
    [router]
  );

  // 3) Build table instance
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 4) Render
  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading orders …</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600">
        No orders available yet!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-gray-200">
              {hg.headers.map((header) =>
                header.isPlaceholder ? null : (
                  <th
                    key={header.id}
                    className="py-2 px-3 font-semibold text-gray-700 text-sm"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2 px-3 text-sm text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
