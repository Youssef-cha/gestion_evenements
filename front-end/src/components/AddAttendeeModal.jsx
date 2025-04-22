import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, UserPlus, X, Users } from "lucide-react";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AddAttendeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  // Fetch teams when the modal opens
  React.useEffect(() => {
    if (isOpen && activeTab === "teams") {
      fetchTeams();
    }
  }, [isOpen, activeTab]);

  const fetchTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const { data } = await axiosClient.get("/teams");
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setIsLoadingTeams(false);
    }
  };

const handleSearch = async (value) => {
    setSearchInput(value);
    
    if (value.length < 2) {
        setSearchResults([]);
        return;
    }

    setIsSearching(true);
    try {
        const { data } = await axiosClient.get("/search-users", {
            params: { search: value },
        });
        // Filter out users that are already selected
        const filteredResults = data.filter(
            user => !selectedUsers.some(selectedUser => selectedUser.id === user.id)
        );
        setSearchResults(filteredResults);
    } catch (error) {
        console.error("Search failed:", error);
        toast.error("Failed to search for users");
    } finally {
        setIsSearching(false);
    }
};

  const selectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchResults([]);
    setSearchInput("");
  };

  const removeUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const toggleTeam = (team) => {
    if (selectedTeams.some((t) => t.id === team.id)) {
      setSelectedTeams((prev) => prev.filter((t) => t.id !== team.id));
    } else {
      setSelectedTeams((prev) => [...prev, team]);
    }
  };

  const handleSubmit = async () => {

    if (selectedUsers.length === 0 && selectedTeams.length === 0) {
      toast.error("Please select at least one user or team");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        user_ids: selectedUsers.map((user) => user.id),
        team_ids: selectedTeams.map((team) => team.id),
      });
      setSelectedUsers([]);
      setSelectedTeams([]);
      onClose();
    } catch (error) {
      console.error("Failed to add attendees:", error);
      toast.error("Failed to add attendees. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Event Attendees</DialogTitle>
          <DialogDescription>
            Add individual users or entire teams to this event.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="users" className="w-full">Users</TabsTrigger>
            <TabsTrigger value="teams" className="w-full">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Search Results */}
            {isSearching ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-md border">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-accent/50 cursor-pointer"
                      onClick={() => selectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )
            )}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {isLoadingTeams ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-md border">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={cn(
                      "flex items-center justify-between p-3 hover:bg-accent/50 cursor-pointer",
                      selectedTeams.some((t) => t.id === team.id) && "bg-accent"
                    )}
                    onClick={() => toggleTeam(team)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.member_count || 0} members
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Selected Items */}
        {(selectedUsers.length > 0 || selectedTeams.length > 0) && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected:</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1 rounded-full bg-accent/50 px-2 py-1 text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-accent"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {selectedTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <span>{team.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleTeam(team)}
                    className="ml-1 rounded-full p-0.5 hover:bg-accent"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              (selectedUsers.length === 0 && selectedTeams.length === 0) ||
              isSubmitting
            }
            className={cn(
              "min-w-[80px]",
              isSubmitting && "cursor-not-allowed opacity-50"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Attendees"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendeeModal;