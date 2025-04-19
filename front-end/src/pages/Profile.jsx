import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Edit, Cat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfileModal from "@/components/EditProfileModal";
import { useSelector } from "react-redux";
import { getAuthUser } from "@/redux/authSlice";
import axiosClient from "@/axios";
import { formatDate } from "@fullcalendar/core";

const ProfilePage = () => {
  const user = useSelector(getAuthUser);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          axiosClient.get("events"),
          axiosClient.get("eventCategories")
        ]);
        
        setAllEvents(eventsResponse.data);
        
        const categoriesWithEvents = categoriesResponse.data.filter(category => 
          eventsResponse.data.some(event => event.category?.id === category.id)
        );
        setCategories(categoriesWithEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchData();
  }, []);

  const filteredEvents = selectedCategory === "All"
    ? allEvents
    : allEvents.filter((event) => event.category?.name === selectedCategory);

  // Sort filtered events by creation date and take only the last 3
  const lastThreeEvents = filteredEvents
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 sm:px-6 lg:px-8">
      <div className="bg-card border-border rounded-lg p-6 md:p-8 mb-8 shadow-lg">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar} alt="User profile" />
            <AvatarFallback className="text-5xl bg-muted text-muted-foreground font-bold">
              <Cat size={80} />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">
                {user.name}
              </h1>
              <button
                className="bg-primary cursor-pointer hover:bg-bl-700 rounded-sm p-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleEditProfile}
                aria-label="Edit profile"
              >
                <Edit className="h-4 w-4 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">
          Last Created Events
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-card hover:bg-accent/10 text-card-foreground border-border flex items-center shadow-md"
            >
              <span>{selectedCategory}</span>
              <span className="ml-2">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border shadow-xl">
            <DropdownMenuItem
              className="hover:bg-accent/10 cursor-pointer font-medium text-popover-foreground"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                className="hover:bg-accent/10 cursor-pointer font-medium text-popover-foreground"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
            {/* Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="bg-card border-border shadow-md">
                    <CardContent className="p-5 sm:p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <div className="space-y-2 text-sm">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Actual Event Cards
                lastThreeEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-card border-border hover:bg-accent/10 transition duration-200 shadow-md"
                  >
                    <CardContent className="p-5 sm:p-6">
                      <h3 className="text-lg font-medium mb-3 text-card-foreground">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Category:{" "}
                          <span className="text-card-foreground font-medium">
                            {event.category?.name || "Uncategorized"}
                          </span>
                        </p>
                        <p className="text-muted-foreground">
                          Start:{" "}
                          <span className="text-card-foreground font-medium">
                            {formatDate(event.start_time)}
                          </span>
                        </p>
                        <p className="text-muted-foreground">
                          End:{" "}
                          <span className="text-card-foreground font-medium">
                            {formatDate(event.end_time)}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
