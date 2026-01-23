"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisIcon,
  SearchIcon,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";

type User = {
  id: string;
  name: string;
  email: string;
  points: number;
  clerkUserId: string;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    authUserId: string;
  }
}

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
  {
    id: "actions",
    cell({ row, table }) {
      const authUserId = table.options.meta?.authUserId;
      const isSelf = row.original.clerkUserId === authUserId;
      if (isSelf) {
        return null;
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-light text-muted-foreground">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/chat/${row.original.clerkUserId}`}
                className="text-neutral-700 cursor-pointer"
              >
                Chat Now
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function Leaderboard(props: {
  preloadedUsers: Preloaded<typeof api.functions.users.getUsers>;
  authUserId: string;
}) {
  const [data, setData] = useState<User[]>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const users = usePreloadedQuery(props.preloadedUsers);
  useEffect(() => {
    const result = users.map((item) => {
      return {
        id: item._id,
        email: item.email,
        name: item.fullName,
        points: item.points,
        clerkUserId: item.clerkUserId,
      };
    });
    setData(result);
  }, [users]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters: filters,
      columnVisibility,
      pagination,
    },
    onPaginationChange: setPagination,
    meta: {
      authUserId: props.authUserId,
    },
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [filters]);
  return (
    <div className="w-full">
      <div className="py-2">
        <p className="text-lg text-neutral-600">Leaderboard Ranking</p>
        <p className="text-sm text-neutral-500 font-light">
          See where you stand among others
        </p>
      </div>
      <div className="pb-4 w-full flex items-center justify-between gap-x-4">
        <InputGroup className="max-w-sm w-full shadow-none">
          <InputGroupInput
            placeholder="Search users by name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="placeholder:text-muted-foreground text-muted-foreground font-light placeholder:font-light"
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <div className="w-full flex justify-end gap-x-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto text-muted-foreground font-light shadow-none"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-muted-foreground font-light"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-x-2 w-full justify-end items-center">
            <Button
              variant="outline"
              size="icon-sm"
              className="shadow-none"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon className="text-muted-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="shadow-none"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRightIcon className="text-muted-foreground" />
            </Button>
          </div>
        </div>
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
