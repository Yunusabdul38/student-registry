"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type Student,
  Gender,
  Program,
  StudentStatus,
  type CreateStudentRequest,
} from "@/types/student";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: CreateStudentRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading,
}: StudentFormProps) {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    dob: student?.dob ? student.dob.split("T")[0] : "",
    gender: student?.gender || Gender.MALE,
    email: student?.email || "",
    program: student?.program || Program.COMPUTER_SCIENCE,
    student_status: student?.student_status || StudentStatus.ACTIVE,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.first_name.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.last_name.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.dob) {
      toast.error("Date of birth is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate age (must be at least 16)
    const birthDate = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16) {
      toast.error("Student must be at least 16 years old");
      return;
    }

    await onSubmit(formData);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 hover:bg-white/50 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registry
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">
              {student ? "Edit Student" : "Add New Student"}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {student
                ? "Update student information"
                : "Enter student details to add to the registry"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label
                    htmlFor="first_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label
                    htmlFor="last_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300"
                  placeholder="student@university.edu"
                />
              </div>

              <div className="space-y-2 group">
                <Label
                  htmlFor="dob"
                  className="text-sm font-medium text-gray-700"
                >
                  Date of Birth *
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700"
                  >
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: Gender) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="program"
                    className="text-sm font-medium text-gray-700"
                  >
                    Program
                  </Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value: Program) =>
                      setFormData({ ...formData, program: value })
                    }
                  >
                    <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Program).map((program) => (
                        <SelectItem key={program} value={program}>
                          {formatProgramName(program)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status
                  </Label>
                  <Select
                    value={formData.student_status}
                    onValueChange={(value: StudentStatus) =>
                      setFormData({ ...formData, student_status: value })
                    }
                  >
                    <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(StudentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatusName(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? "Saving..."
                    : student
                    ? "Update Student"
                    : "Add Student"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-8 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
