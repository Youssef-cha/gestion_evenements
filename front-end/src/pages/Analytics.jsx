import CategoriesPieChart from "@/components/CategoriesPieChart";
import CategoryBarChart from "@/components/CategoryBarChart";
import EventAreaChart from "@/components/EventAreaChart";

export default function Analytics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
        <EventAreaChart />

        <CategoryBarChart />
        <CategoriesPieChart />
    </div>
  );
}
