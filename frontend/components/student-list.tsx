"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type Student,
//   type Gender,
  Program,
  StudentStatus,
} from "@/types/student";
import {
  Edit,
  Trash2,
  Mail,
  Calendar,
  User,
  GraduationCap,
  BadgeIcon as IdCard,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => Promise<void>;
  onStatusChange: (id: number, status: StudentStatus) => Promise<void>;
  isLoading?: boolean;
}

export function StudentList({
  students,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading,
}: StudentListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatProgramName = (program: Program) => {
    return program
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatStatusName = (status: StudentStatus) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getGenderIcon = () => {
    return <User className="h-4 w-4" />;
  };

  const getProgramColor = (program: Program) => {
    const colors = {
      [Program.COMPUTER_SCIENCE]: "bg-blue-100 text-blue-800 border-blue-200",
      [Program.ENGINEERING]: "bg-orange-100 text-orange-800 border-orange-200",
      [Program.BUSINESS]: "bg-green-100 text-green-800 border-green-200",
      [Program.MEDICINE]: "bg-red-100 text-red-800 border-red-200",
      [Program.LAW]: "bg-purple-100 text-purple-800 border-purple-200",
      [Program.ARTS]: "bg-pink-100 text-pink-800 border-pink-200",
      [Program.SCIENCE]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[program] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status: StudentStatus) => {
    const colors = {
      [StudentStatus.ACTIVE]: "bg-green-100 text-green-800 border-green-200",
      [StudentStatus.INACTIVE]: "bg-gray-100 text-gray-800 border-gray-200",
      [StudentStatus.GRADUATED]: "bg-blue-100 text-blue-800 border-blue-200",
      [StudentStatus.SUSPENDED]: "bg-red-100 text-red-800 border-red-200",
      [StudentStatus.TRANSFERRED]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (
    studentId: number,
    newStatus: StudentStatus
  ) => {
    await onStatusChange(studentId, newStatus);
  };

  if (students.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            No students found
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Get started by adding your first student to the registry. Click the
            &quot;Add Student&quot; button to begin.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student, index) => (
          <Card
            key={student.id}
            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {student.first_name} {student.last_name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono text-gray-600">
                      {student.student_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    {getGenderIcon()}
                    <span className="capitalize">
                      {student.gender.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    className={`${getProgramColor(
                      student.program
                    )} border text-xs font-medium`}
                  >
                    {formatProgramName(student.program)}
                  </Badge>
                  <Badge
                    className={`${getStatusColor(
                      student.student_status
                    )} border text-xs font-medium`}
                  >
                    {formatStatusName(student.student_status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate text-gray-700">
                    {student.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    Born {formatDate(student.dob)}
                  </span>
                </div>
                {student.created_at && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Enrolled {formatDate(student.created_at)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    Quick Status Change
                  </label>
                  <Select
                    value={student.student_status}
                    onValueChange={(value: StudentStatus) =>
                      handleStatusChange(student.id!, value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(StudentStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-xs"
                        >
                          {formatStatusName(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(student)}
                    disabled={isLoading}
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(student.id!)}
                    disabled={isLoading}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the
              student from the registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
