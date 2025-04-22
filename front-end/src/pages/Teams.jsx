"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Plus, Search, Star, StarOff } from "lucide-react";
import axiosClient from "@/axios";
import { toast } from "sonner";
import CreateTeamModal from "@/components/CreateTeamModal";
import TeamDetails from "@/components/TeamDetails";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isViewingTeam, setIsViewingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Fetch teams
  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosClient.get("/teams");
      setTeams(data);

      // Filter favorite teams
      const favorites = data.filter((team) => team.is_favorite);
      setFavoriteTeams(favorites);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast.error("Failed to load teams. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Filter teams based on search query
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFavorites = favoriteTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle favorite status
  const toggleFavorite = async (team) => {
    const updatedTeam = { ...team, is_favorite: !team.is_favorite };
    const originalTeams = [...teams];
    const originalFavorites = [...favoriteTeams];

    // Optimistically update UI
    setTeams(teams.map((t) => (t.id === team.id ? updatedTeam : t)));
    if (updatedTeam.is_favorite) {
      setFavoriteTeams((prevFavorites) => [...prevFavorites, updatedTeam]);
    } else {
      setFavoriteTeams((prevFavorites) =>
        prevFavorites.filter((t) => t.id !== team.id)
      );
    }

    try {
      await axiosClient.put(`/teams/${team.id}/favorite`);
      toast.success(
        `${team.name} ${
          updatedTeam.is_favorite ? "added to" : "removed from"
        } favorites`
      );
    } catch (error) {
      // Rollback on error
      setTeams(originalTeams);
      setFavoriteTeams(originalFavorites);
      console.error("Failed to update favorite status:", error);
      toast.error("Failed to update favorite status. Please try again.");
    }
  };

  // Handle team creation
  const handleCreateTeam = async (teamData) => {
    try {
      const { data } = await axiosClient.post("/teams", teamData);
      setTeams([data, ...teams]);
      toast.success("Team created successfully!");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create team:", error);
      toast.error("Failed to create team. Please try again.");
    }
  };

  // Handle team update
  const handleUpdateTeam = async (teamData) => {
    try {
      const { data } = await axiosClient.put(`/teams/${teamData.id}`, teamData);
      setTeams(teams.map((team) => (team.id === data.id ? data : team)));

      // Update favorites if needed
      if (data.is_favorite) {
        setFavoriteTeams(
          favoriteTeams.map((team) => (team.id === data.id ? data : team))
        );
      }

      toast.success("Team updated successfully!");
      setEditingTeam(null);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to update team:", error);
      toast.error("Failed to update team. Please try again.");
    }
  };

  // Handle team deletion
  const handleDeleteTeam = async (teamId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This will remove all members from the team."
      )
    ) {
      try {
        await axiosClient.delete(`/teams/${teamId}`);
        setTeams(teams.filter((team) => team.id !== teamId));
        setFavoriteTeams(favoriteTeams.filter((team) => team.id !== teamId));
        toast.success("Team deleted successfully!");

        // If viewing the deleted team, go back to list
        if (selectedTeam && selectedTeam.id === teamId) {
          setSelectedTeam(null);
          setIsViewingTeam(false);
        }
      } catch (error) {
        console.error("Failed to delete team:", error);
        toast.error("Failed to delete team. Please try again.");
      }
    }
  };

  // View team details
  const viewTeamDetails = async (team) => {
      setSelectedTeam(team);
      setIsViewingTeam(true);
  };

  // Edit team
  const editTeam = async (team) => {
    setEditingTeam(team);
    setIsCreateModalOpen(true);
  };

  // Render team card
  const renderTeamCard = (team) => (
    <Card
      key={team.id}
      className="hover:shadow-md transition-shadow duration-200"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle
              className="text-xl cursor-pointer hover:text-primary transition-colors"
              onClick={() => viewTeamDetails(team)}
            >
              {team.name}
            </CardTitle>
            <CardDescription>
              {team.description || "No description"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(team)}
            aria-label={
              team.is_favorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {team.is_favorite ? (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-5 w-5 text-neutral-400" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-neutral-500" />
            <span className="text-sm text-neutral-500">
              {team.member_count || 0} members
            </span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => editTeam(team)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => handleDeleteTeam(team.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render skeleton loader
  const renderSkeletons = () =>
    Array(3)
      .fill()
      .map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <div className="space-x-2">
                <Skeleton className="h-9 w-16 inline-block" />
                <Skeleton className="h-9 w-16 inline-block" />
              </div>
            </div>
          </CardContent>
        </Card>
      ));

  // If viewing a specific team
  if (isViewingTeam && selectedTeam) {
    return (
      <TeamDetails
        team={selectedTeam}
        onBack={() => {
          setIsViewingTeam(false);
          setSelectedTeam(null);
          fetchTeams(); // Refresh teams when returning to list
        }}
        onDelete={() => handleDeleteTeam(selectedTeam.id)}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your teams and team members
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingTeam(null);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search teams..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            renderSkeletons()
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map(renderTeamCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No teams found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first team to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Create Team
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {isLoading ? (
            renderSkeletons()
          ) : filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map(renderTeamCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorite teams</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                {searchQuery
                  ? "Try a different search term"
                  : "Mark teams as favorites to see them here"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}
        team={editingTeam}
      />
    </div>
  );
};

export default Teams;
