"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";

export function TableView() {
  return (
    <div className="my-4">
      <Table className="border">
        <TableHeader className="bg-sidebar">
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Key Name</TableHead>
            <TableHead>Public Key</TableHead>
            <TableHead>Secret Key</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-muted-foreground font-light">
            <TableCell>Stripe</TableCell>
            <TableCell>Pawcare Key</TableCell>
            <TableCell>sk_public*****</TableCell>
            <TableCell>sk_secret*****</TableCell>
            <TableCell>29 January 2026</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-none shadow-none font-normal"
              >
                Delete Keys
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
