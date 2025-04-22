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
import { Loader2, Search, UserPlus, X } from "lucide-react";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AddMemberModal = ({ isOpen, onClose, onSubmit, existingMembers }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Filter out existing members and already selected users
      const filteredResults = data.filter(
        (user) =>
          !existingMembers?.some((member) => member.id === user.id) &&
          !selectedUsers.some((selected) => selected.id === user.id)
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

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to add");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ user_ids: selectedUsers.map((user) => user.id) });
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Failed to add members:", error);
      toast.error("Failed to add members. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
          <DialogDescription>
            Search and select users to add to your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Users:</p>
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
              </div>
            </div>
          )}
        </div>

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
            disabled={selectedUsers.length === 0 || isSubmitting}
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
              "Add Members"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
