"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

type User = {
  id: string;
  name: string;
  email: string;
  points: number;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];

export function Leaderboard(props: {
  preloadedUsers: Preloaded<typeof api.functions.users.getUsers>;
}) {
  const [data, setData] = useState<User[]>([]);
  const users = usePreloadedQuery(props.preloadedUsers);
  useEffect(() => {
    const result = users.map((item) => {
      return {
        id: item._id,
        email: item.email,
        name: item.fullName,
        points: item.points,
      };
    });
    setData(result);
  }, [users]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="my-4">
      <div className="py-4">
        <p className="text-lg text-neutral-600">Leaderboard Ranking</p>
        <p className="text-sm text-neutral-500 font-light">
          See where you stand among others
        </p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((item) => (
              <TableRow key={item.id}>
                {item.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-normal text-neutral-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-muted-foreground font-light"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
