import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Mail, Edit, Cat } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfileModal from "@/components/EditProfileModal";
import { useOutletContext } from "react-router";
import { useSelector } from "react-redux";
import { getAuthUser } from "@/redux/authSlice";

// Mock data for events
const initialEvents = [
  {
    id: 1,
    title: "Have Dinner With My Family",
    hasReminder: false,
    date: "20/05/2025",
    allDays: true,
    category: "Work",
  },
  {
    id: 2,
    title: "Have Dinner With My Family",
    hasReminder: false,
    date: "20/05/2025",
    allDays: true,
    category: "Family",
  },
  {
    id: 3,
    title: "Have Dinner With My Family",
    hasReminder: false,
    date: "20/05/2025",
    allDays: true,
    category: "Family",
  },
];

const ProfilePage = () => {
  const user = useSelector(getAuthUser);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState(initialEvents);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

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
            <AvatarImage src="" alt="User profile" />
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
                className="bg-bl-500 cursor-pointer hover:bg-bl-700 rounded-sm p-2 focus:ring-bl-500 focus:ring-offset-2"
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
            <DropdownMenuItem
              className="hover:bg-accent/10 cursor-pointer font-medium text-popover-foreground"
              onClick={() => setSelectedCategory("Family")}
            >
              Family
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-accent/10 cursor-pointer font-medium text-popover-foreground"
              onClick={() => setSelectedCategory("Work")}
            >
              Work
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-accent/10 cursor-pointer font-medium text-popover-foreground"
              onClick={() => setSelectedCategory("Personal")}
            >
              Personal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredEvents.map((event) => (
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
                  has a reminder:{" "}
                  <span className="text-card-foreground font-medium">
                    {event.hasReminder ? "yes" : "no"}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  date:{" "}
                  <span className="text-card-foreground font-medium">
                    {event.date}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  all days:{" "}
                  <span className="text-card-foreground font-medium">
                    {event.allDays ? "yes" : "no"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Profile Modal */}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
