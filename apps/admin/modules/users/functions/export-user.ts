import * as XLSX from "xlsx";
import type { User } from "../views/table-view";

export function exportSingleUserToExcel(user: User) {
  const data = [
    {
      "Full Name": user.fullName,
      Email: user.email,
      "Phone Number": user.phoneNumber,
      "Permanent Address": user.permanentAddress,
      Points: user.points,
      "Date of Birth": user.dateOfBirth,
      "Clerk User ID": user.clerkUserId,
      "Created At": new Date(user._creationTime).toLocaleString(),
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "User");

  XLSX.writeFile(workbook, `${user.fullName.replace(/\s+/g, "_")}.xlsx`);
}
