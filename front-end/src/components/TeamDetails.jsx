"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Mail,
  UserMinus,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/axios";
import AddMemberModal from "./AddMemberModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { getAuthUser } from "@/redux/authSlice";

const TeamDetails = ({ team, onBack, onDelete }) => {
  const authUser = useSelector(getAuthUser);
  const [members, setMembers] = useState(team.members);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add member to team
  const handleAddMember = async (memberData) => {
    try {
      const { data } = await axiosClient.post(
        `/teams/${team.id}/members`,
        memberData
      );
      // Handle both single member and multiple members
      console.log(data);
      setMembers(data);
      toast.success("Member(s) added successfully");
      setIsAddMemberModalOpen(false);
    } catch (error) {
      console.error("Failed to add member(s):", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add member(s). Please try again."
      );
    }
  };

  // Remove member from team
  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await axiosClient.delete(`/teams/${team.id}/members`, {
        data: { user_ids: [memberToRemove.id] },
      });
      setMembers(members.filter((member) => member.id !== memberToRemove.id));
      toast.success(`${memberToRemove.name} removed from the team`);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member. Please try again.");
    }
  };

  // Handle mass deletion of members
  const handleMassDelete = async () => {
    if (selectedMembers.length === 0) return;

    try {
      await axiosClient.delete(`/teams/${team.id}/members`, {
        data: { user_ids: selectedMembers },
      });
      setMembers(
        members.filter((member) => !selectedMembers.includes(member.id))
      );
      toast.success(`${selectedMembers.length} members removed from the team`);
      setSelectedMembers([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to remove members:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to remove members. Please try again."
      );
    }
  };

  const toggleMember = (memberId) => {
    // Don't allow selecting the auth user
    if (memberId === authUser.id) return;

    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleAllMembers = () => {
    // Filter out the auth user when selecting all
    const selectableMembers = filteredMembers
      .filter((member) => member.id !== authUser.id)
      .map((member) => member.id);

    setSelectedMembers((prev) =>
      prev.length === selectableMembers.length ? [] : selectableMembers
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Back to teams"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {team.description || "No description"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-neutral-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete Team
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {selectedMembers.length > 0 && (
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <UserMinus className="h-4 w-4" />
              Delete Selected ({selectedMembers.length})
            </Button>
          )}
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Team Members</CardTitle>
            {filteredMembers.length > 0 && (
              <Checkbox
                checked={
                  selectedMembers.length ===
                    filteredMembers.filter((m) => m.id !== authUser.id)
                      .length && selectedMembers.length > 0
                }
                onCheckedChange={toggleAllMembers}
                aria-label="Select all members"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length > 0 ? (
            <div className="divide-y">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-4 px-2"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                      disabled={member.id === authUser.id}
                      aria-label={`Select ${member.name}`}
                    />
                    <Avatar>
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <div className="flex items-center text-sm text-neutral-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => setMemberToRemove(member)}
                    disabled={member.id === authUser.id}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Add members to your team to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddMemberModalOpen(true)}>
                  Add Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSubmit={handleAddMember}
        existingMembers={members}
      />

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Members</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMembers.length} members
              from this team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMassDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from this
              team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamDetails;
