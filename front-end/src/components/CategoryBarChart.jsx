import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
// Add Skeleton import
import { Skeleton } from "@/components/ui/skeleton";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/axios";
const config = {
  category: {
    label: "Category",
  }
}
function CategoryBarChart() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/analytics/bar-chart");
        const data = response.data;
        setData(data);

        const uniqueYears = [...new Set(data.map((item) => item.year))].sort((a, b) => b - a);
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0]?.toString() || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const yearData = data.filter((item) => item.year === Number(selectedYear));
    const preparedData = yearData.map((item) => ({
      category: item.category,
      events: item.number_of_events,
    }));
    setChartData(preparedData);
  }, [selectedYear, data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Events by Category</CardTitle>
            <CardDescription>
              Distribution for {loading ? "..." : selectedYear}
            </CardDescription>
          </div>
          {loading ? (
            <Skeleton className="h-10 w-[180px]" />
          ) : (
            <Select
              value={selectedYear}
              onValueChange={(value) => setSelectedYear(value)}
              disabled={years.length <= 1}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[250px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {chartData.length > 0 ? (
              <ChartContainer config={config}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="events" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
                No data available for the selected year.
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {loading ? (
          <div className="flex w-full items-start gap-2">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : (
          <div className="leading-none text-muted-foreground">
            Showing event distribution by category for {selectedYear}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default CategoryBarChart;
