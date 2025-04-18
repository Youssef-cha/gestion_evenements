import React, { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";
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
import axios from "@/axios";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to generate colors dynamically
const generateColor = (index) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const CategoriesPieChart = () => {
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/analytics/pie-chart");
        const rawData = response.data;
        setAllData(response.data);

        // Extract unique years and sort them descending
        const years = [...new Set(rawData.map((item) => item.year))].sort(
          (a, b) => b - a
        );
        setAvailableYears(years);
      } catch (err) {
        console.error("Error fetching pie chart data:", err);
        setError("Failed to load chart data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!allData.length) return;

    let filteredData;
    if (selectedYear === "All") {
      const aggregated = allData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.number_of_events;
        return acc;
      }, {});

      filteredData = Object.entries(aggregated).map(([category, count]) => ({
        category,
        number_of_events: count,
      }));
    } else {
      // Filter data for the selected year
      filteredData = allData.filter(
        (item) => item.year.toString() === selectedYear
      );
    }

    const preparedData = filteredData.map((item, index) => ({
      category: item.category,
      number_of_events: item.number_of_events,
      fill: generateColor(index),
    }));

    const preparedConfig = filteredData.reduce(
      (config, item, index) => {
        config[item.category] = {
          label: item.category,
          color: generateColor(index),
        };
        return config;
      },
      {
       
      }
    );

    setChartData(preparedData);
    setChartConfig(preparedConfig);
  }, [allData, selectedYear]);

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center h-[350px]">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>
          <div className="mt-2 w-full flex justify-between items-center">
            <span>
              Number of events per category
              {selectedYear === "All"
                ? "across all years"
                : `for ${selectedYear}`}
            </span>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={isLoading || !availableYears.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Skeleton className="w-[250px] h-[250px] rounded-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">
              No data available for{" "}
              {selectedYear === "All" ? "the selected period" : selectedYear}.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] px-0"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    nameKey="number_of_events"
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="number_of_events"
                nameKey="category"
                innerRadius={0}
                strokeWidth={5}
                labelLine={false}
                label={({ payload, ...props }) => {
                  const sum = chartData.reduce((acc,item) => acc + item.number_of_events, 0);
                  const percentage = ((payload.number_of_events / sum) * 100).toFixed(1);
                  if(percentage < 5) return null; // Hide labels with less than 5%
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="white"
                      fontSize="10" // Adjust font size as needed
                    >
                      {payload.category}
                    </text>
                  );
                }}
              ></Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      {/* Keep or update the footer as needed */}
      <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="leading-none text-muted-foreground">
          Distribution of event categories{" "}
          {selectedYear === "All" ? "" : `in ${selectedYear}`}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoriesPieChart;
