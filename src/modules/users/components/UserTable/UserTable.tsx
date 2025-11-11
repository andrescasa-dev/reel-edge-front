"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { type User } from "@/modules/users/types";
import styles from "./UserTable.module.css";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusBadgeClass = (status: User["status"]): string => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "inactive":
        return styles.statusInactive;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Register Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{formatDate(user.registerDate)}</TableCell>
              <TableCell>
                <span className={getStatusBadgeClass(user.status)}>
                  {user.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

