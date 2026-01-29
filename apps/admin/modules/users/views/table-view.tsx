"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery } from "convex/react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  VisibilityState,
  getFilteredRowModel,
  getSortedRowModel,
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
import {
  ChevronLeft,
  ChevronRight,
  MailIcon,
  MoreHorizontal,
  UserIcon,
  SearchIcon,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Checkbox } from "@workspace/ui/components/checkbox";
import Image from "next/image";
import { exportAllUsers } from "../functions/export-all";
import { exportSingleUserToExcel } from "../functions/export-user";
import { DeleteUser } from "../components/delete-users";

export type User = {
  _id: Id<"citizens">;
  _creationTime: number;
  userId: string;
  points: number;
  phoneNumber: string;
  permanentAddress: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  clerkUserId: string;
};

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded-none! shadow-none! bg-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded-none! shadow-none!"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0! font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Full Name</span>
          <ArrowUpDown className="size-4 text-neutral-600" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0! font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Email</span>
          <ArrowUpDown className="size-4 text-neutral-600" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0! font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Phone Number</span>
          <ArrowUpDown className="size-4 text-neutral-600" />
        </Button>
      );
    },
  },
  {
    accessorKey: "permanentAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0! font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Permanent Address</span>
          <ArrowUpDown className="size-4 text-neutral-600" />
        </Button>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-none!">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-none">
            <DropdownMenuLabel className="text-sm font-light text-muted-foreground">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer rounded-none font-normal"
              onClick={() => exportSingleUserToExcel(user)}
            >
              <UserIcon />
              <span>Export User</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-none font-normal">
              <MailIcon />
              <span>Send Email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TableView(props: {
  preloadedUsers: Preloaded<typeof api.functions.users.getUsers>;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const users: User[] = usePreloadedQuery(props.preloadedUsers);
  if (users && users.length === 0) {
    return (
      <div className="my-4">
        <p className="text-red-500 font-light">
          Oops!, There are no users using Urban Watch.
        </p>
      </div>
    );
  }
  if (users && users.length > 0) {
    const table = useReactTable({
      data: users,
      columns,
      getRowId: (row) => row._id,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    });
    return (
      <div className="my-4 w-full">
        <div className="mb-4 flex items-start justify-between">
          <div className="w-full flex justify-start items-center gap-x-4">
            <InputGroup className="max-w-xs w-full shadow-none rounded-none">
              <InputGroupInput
                placeholder="Search users by name"
                onChange={(event) =>
                  table
                    .getColumn("fullName")
                    ?.setFilterValue(event.target.value)
                }
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <Button
              variant="outline"
              className="font-normal rounded-none shadow-none bg-sidebar!"
              onClick={() => exportAllUsers(users)}
            >
              <span>Export all users</span>
              <Image
                src="/icons/excel.svg"
                height={16}
                width={16}
                alt="excel_logo"
              />
            </Button>
          </div>
          <div className="flex justify-end items-center gap-x-4">
            <div className="w-full flex justify-end gap-x-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-sidebar! border font-normal shadow-none rounded-none!"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-sidebar! border font-normal shadow-none rounded-none!"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
            <DeleteUser
              count={table.getFilteredSelectedRowModel().rows.length}
              userIds={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original._id)}
              onDeleted={() => table.resetRowSelection()}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="ml-auto bg-sidebar! border font-normal shadow-none rounded-none!"
                >
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize font-light cursor-pointer rounded-none text-muted-foreground"
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
          </div>
        </div>
        <div className="w-full shadow-none border">
          <Table>
            <TableHeader className="bg-sidebar">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-normal">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
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
                        className="font-light text-muted-foreground"
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
}
