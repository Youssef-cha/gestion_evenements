import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "@/axios";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const chartConfig = {
  events: {
    label: "events",
    color: "hsl(var(--chart-1))",
  },
};

const EventAreaChart = () => {
  const [years, setYears] = useState({}); // Initialize as object
  const [selectedYear, setSelectedYear] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  function sortByMonth(arr) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    arr.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/analytics");
      const groupedData = Object.groupBy(response.data, ({ year }) => year);

      setYears(groupedData);

      // Set the default year to the most recent year
      const sortedYears = Object.keys(groupedData).sort((a, b) => b - a);
      if (sortedYears.length > 0) {
        const latestYear = sortedYears[0];
        setSelectedYear(latestYear);
        sortByMonth(groupedData[latestYear]);
        setChartData(groupedData[latestYear] || []);
      } else {
        setSelectedYear(null);
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setYears({});
      setSelectedYear(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    sortByMonth(years[year]);
    setChartData(years[year] || []);
  };

  const averageEvents =
    chartData.length > 0
      ? (
          chartData.reduce((sum, item) => sum + item.events, 0) /
          chartData.length
        ).toFixed(1)
      : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Analytics</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <span>
              Number of events created per month in{" "}
              {loading ? "..." : selectedYear || "N/A"}.
            </span>
            {loading ? (
              <Skeleton className="h-10 w-[180px]" />
            ) : (
              <Select
                value={selectedYear || ""}
                onValueChange={handleYearChange}
                disabled={Object.keys(years).length === 0} // Disable if no years
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(years)
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Skeleton Loader
          <div className="space-y-4">
            <Skeleton className="h-[250px] w-full" /> {/* Chart Skeleton */}
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ) : (
          // Actual Chart with Animation
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 5,
                    right: 5,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="20%"
                        stopColor="var(--primary)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="80%"
                        stopColor="var(--primary)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="events"
                    type="natural"
                    fill="url(#fillEvents)"
                    fillOpacity={0.4}
                    stroke="var(--primary)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
                No data available for the selected year.
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        {loading ? (
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {chartData.length > 0
                  ? `Average of ${averageEvents} events per month this year.`
                  : "No event data for this year."}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {selectedYear
                  ? `Showing data for the year ${selectedYear}`
                  : "No year selected"}
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventAreaChart;
