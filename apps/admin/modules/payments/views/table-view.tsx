"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { format } from "date-fns";
import { DeleteKeys } from "../components/delete-keys";

export function TableView() {
  const keys = useQuery(api.functions.payments.retriveKeys);
  if (keys === undefined) {
    return (
      <div className="my-4">
        <p className="text-muted-foreground font-light animate-ping">
          Loading Keys...
        </p>
      </div>
    );
  }
  if (keys.length === 0) {
    return (
      <div className="my-4">
        <p className="text-red-500 font-light">
          You have not enabled payments yet
        </p>
      </div>
    );
  }
  return (
    <div className="my-4">
      <Table className="border">
        <TableHeader className="bg-sidebar">
          <TableRow>
            <TableHead className="font-normal">Provider</TableHead>
            <TableHead className="font-normal">Key Name</TableHead>
            <TableHead className="font-normal">Public Key</TableHead>
            <TableHead className="font-normal">Secret Key</TableHead>
            <TableHead className="font-normal">Submitted At</TableHead>
            <TableHead className="font-normal">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-muted-foreground font-light">
            <TableCell>{keys[0]?.provider}</TableCell>
            <TableCell>{keys[0]?.keyName}</TableCell>
            <TableCell>{keys[0]?.publicKeyPrefix}*****</TableCell>
            <TableCell>{keys[0]?.secretKeyPrefix}*****</TableCell>
            <TableCell>
              {format(new Date(keys[0]?._creationTime!), "d MMMM yyyy")}
            </TableCell>
            <TableCell>
              <DeleteKeys keyId={keys[0]?._id} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
