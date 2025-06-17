"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, UserCheck, UserX } from "lucide-react";

interface Stats {
  general: {
    total_students: number;
    active_students: number;
    graduated_students: number;
    suspended_students: number;
    inactive_students: number;
    transferred_students: number;
    male_students: number;
    female_students: number;
    other_gender_students: number;
  };
  programs: Array<{
    program: string;
    count: number;
  }>;
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/students/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatProgramName = (program: string) => {
    return program
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statusStats = [
    {
      title: "Total Students",
      value: stats.general.total_students,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Students",
      value: stats.general.active_students,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Graduated",
      value: stats.general.graduated_students,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Suspended",
      value: stats.general.suspended_students,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusStats.map((stat, index) => (
          <Card
            key={stat.title}
            className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {stat.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    {stat.title}
                  </p>
                </div>
                <div
                  className={`${stat.bgColor} p-3 rounded-full group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gender Distribution */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Gender Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {stats.general.male_students}
              </div>
              <div className="text-sm text-gray-600">Male</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-pink-600">
                {stats.general.female_students}
              </div>
              <div className="text-sm text-gray-600">Female</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {stats.general.other_gender_students}
              </div>
              <div className="text-sm text-gray-600">Other</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Distribution */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Students by Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.programs.map((program, index) => (
              <div
                key={program.program}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-sm font-medium text-gray-700">
                  {formatProgramName(program.program)}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {program.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
