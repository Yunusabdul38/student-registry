"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StudentForm } from "@/components/student-form";
import { StudentList } from "@/components/student-list";
import { StatsDashboard } from "@/components/stats-dashboard";
import {
  type Student,
  type CreateStudentRequest,
  Program,
  Gender,
  StudentStatus,
} from "@/types/student";
import { Plus, Search, Users, Filter, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentRegistry() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterProgram, filterGender, filterStatus]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterProgram !== "all") params.append("program", filterProgram);
      if (filterGender !== "all") params.append("gender", filterGender);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`http://0.0.0.0:2005/get-all-students`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setStudents(data);
      } else {
        toast.error("Failed to fetch students");
      }
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterProgram !== "all") {
      filtered = filtered.filter(
        (student) => student.program === filterProgram
      );
    }

    if (filterGender !== "all") {
      filtered = filtered.filter((student) => student.gender === filterGender);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.student_status === filterStatus
      );
    }

    setFilteredStudents(filtered);
  };

  const handleCreateStudent = async (data: CreateStudentRequest) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchStudents();
        setShowForm(false);
        toast.success("Student added successfully", {
          description: `${data.first_name} ${data.last_name} has been registered`,
        });
      } else {
        const error = await response.json();
        toast.error("Failed to add student", {
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to add student", {
        description: "Network error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (data: CreateStudentRequest) => {
    if (!editingStudent) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchStudents();
        setEditingStudent(null);
        setShowForm(false);
        toast.success("Student updated successfully", {
          description: `${data.first_name} ${data.last_name}'s information has been updated`,
        });
      } else {
        const error = await response.json();
        toast.error("Failed to update student", {
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update student", {
        description: "Network error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchStudents();
        toast.success("Student deleted successfully", {
          description: "Student has been removed from the registry",
        });
      } else {
        toast.error("Failed to delete student", {
          description: "Please try again",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete student", {
        description: "Network error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: StudentStatus) => {
    try {
      const response = await fetch(`/api/students/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchStudents();
        toast.success("Status updated successfully", {
          description: `Student status changed to ${status.toLowerCase()}`,
        });
      } else {
        toast.error("Failed to update status", {
          description: "Please try again",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status", {
        description: "Network error occurred",
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
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

  if (showForm) {
    return (
      <StudentForm
        student={editingStudent || undefined}
        onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl animate-in slide-in-from-top-4 duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                    <Users className="h-8 w-8" />
                    Student Registry System
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-2">
                    Comprehensive student management and records system
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              {/* Filters */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-5 w-5" />
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <Select
                      value={filterProgram}
                      onValueChange={setFilterProgram}
                    >
                      <SelectTrigger className="transition-all duration-200 hover:border-blue-300">
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {Object.values(Program).map((program) => (
                          <SelectItem key={program} value={program}>
                            {formatProgramName(program)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterGender}
                      onValueChange={setFilterGender}
                    >
                      <SelectTrigger className="transition-all duration-200 hover:border-blue-300">
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        {Object.values(Gender).map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender.charAt(0) + gender.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="transition-all duration-200 hover:border-blue-300">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.values(StudentStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {formatStatusName(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Results Summary */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-800">
                        {filteredStudents.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-800">
                        {students.length}
                      </span>{" "}
                      students
                    </div>
                    {(searchTerm ||
                      filterProgram !== "all" ||
                      filterGender !== "all" ||
                      filterStatus !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterProgram("all");
                          setFilterGender("all");
                          setFilterStatus("all");
                        }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Student List */}
              <div className="animate-in slide-in-from-bottom-4 duration-700">
                <StudentList
                  students={filteredStudents}
                  onEdit={handleEdit}
                  onDelete={handleDeleteStudent}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="analytics"
              className="animate-in slide-in-from-bottom-4 duration-500"
            >
              <StatsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
