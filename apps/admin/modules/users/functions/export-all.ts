import * as XLSX from "xlsx";
import type { User } from "../views/table-view";

export function exportAllUsers(users: User[]) {
  const formattedData = users.map((user) => ({
    "Full Name": user.fullName,
    Email: user.email,
    "Phone Number": user.phoneNumber,
    "Permanent Address": user.permanentAddress,
    Points: user.points,
    "Date of Birth": user.dateOfBirth,
    "Clerk User ID": user.clerkUserId,
    "Created At": new Date(user._creationTime).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  XLSX.writeFile(workbook, "urban-watch-users.xlsx");
}
