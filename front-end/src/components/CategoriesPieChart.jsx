"use client"

import { useState, useEffect } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "@/axios"
import { Skeleton } from "@/components/ui/skeleton"

// Carefully selected color palette for data visualization
// These colors are distinct, accessible, and harmonious
const COLOR_PALETTE = [
  "#3b82f6", // Blue
  "#f97316", // Orange
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#ef4444", // Red
  "#14b8a6", // Teal
  "#8b5cf6", // Violet
  "#84cc16", // Lime
  "#f43f5e", // Rose
  "#0ea5e9", // Sky
  "#d946ef", // Fuchsia
]

// Function to get a color from the palette with fallback
const getColor = (index) => {
  return COLOR_PALETTE[index % COLOR_PALETTE.length]
}

const CategoriesPieChart = () => {
  const [allData, setAllData] = useState([])
  const [availableYears, setAvailableYears] = useState([])
  const [selectedYear, setSelectedYear] = useState("All")
  const [chartData, setChartData] = useState([])
  const [chartConfig, setChartConfig] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get("/analytics/pie-chart")
        const rawData = response.data
        setAllData(response.data)

        // Extract unique years and sort them descending
        const years = [...new Set(rawData.map((item) => item.year))].sort((a, b) => b - a)
        setAvailableYears(years)
      } catch (err) {
        console.error("Error fetching pie chart data:", err)
        setError("Failed to load chart data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!allData.length) return

    let filteredData
    if (selectedYear === "All") {
      const aggregated = allData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.number_of_events
        return acc
      }, {})

      filteredData = Object.entries(aggregated).map(([category, count]) => ({
        category,
        number_of_events: count,
      }))
    } else {
      // Filter data for the selected year
      filteredData = allData.filter((item) => item.year.toString() === selectedYear)
    }

    // Sort data by number of events (descending) for better visual hierarchy
    filteredData.sort((a, b) => b.number_of_events - a.number_of_events)

    const preparedData = filteredData.map((item, index) => ({
      category: item.category,
      number_of_events: item.number_of_events,
      fill: getColor(index),
    }))

    const preparedConfig = filteredData.reduce((config, item, index) => {
      config[item.category] = {
        label: item.category,
        color: getColor(index),
      }
      return config
    }, {})

    setChartData(preparedData)
    setChartConfig(preparedConfig)
  }, [allData, selectedYear])

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
    )
  }

  // Calculate total for percentage display
  const total = chartData.reduce((sum, item) => sum + item.number_of_events, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>
          <div className="mt-2 w-full flex justify-between items-center">
            <span>
              Number of events per category
              {selectedYear === "All" ? " across all years" : ` for ${selectedYear}`}
            </span>
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isLoading || !availableYears.length}>
              <SelectTrigger className="w-[130px]">
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
              No data available for {selectedYear === "All" ? "the selected period" : selectedYear}.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] px-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      nameKey="category"
                      formatter={(value) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, "Events"]}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="number_of_events"
                  nameKey="category"
                  innerRadius={0}
                  outerRadius="80%"
                  paddingAngle={0}
                  strokeWidth={1}
                  stroke="#155DFC"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    const percentage = ((payload.number_of_events / total) * 100).toFixed(1)
                    if (percentage < 5) return null // Hide labels with less than 5%
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="white"
                        fontSize="11"
                        fontWeight="500"
                      >
                        {payload.category}
                      </text>
                    )
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="leading-none text-muted-foreground">
          Distribution of event categories {selectedYear === "All" ? "" : `in ${selectedYear}`}
        </div>
        {chartData.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs">
                  {item.category} ({((item.number_of_events / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default CategoriesPieChart
