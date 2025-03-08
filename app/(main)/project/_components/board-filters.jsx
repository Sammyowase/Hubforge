"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function BoardFilters({ issues, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  // Memoize the list of assignees to prevent unnecessary re-renders
  const assignees = useMemo(() => {
    return issues
      .map((issue) => issue.assignee)
      .filter((assignee) => assignee && assignee.id) // Filter out undefined/null assignees
      .filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
  }, [issues]);

  useEffect(() => {
    if (typeof onFilterChange !== "function") return;

    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          (issue.assignee && selectedAssignees.includes(issue.assignee.id))) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );

    if (filteredIssues.length !== issues.length || searchTerm || selectedAssignees.length || selectedPriority) {
      onFilterChange(filteredIssues);
    }
  }, [searchTerm, selectedAssignees, selectedPriority, issues, onFilterChange]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className="w-full sm:w-72"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.length > 0 ? (
              assignees.map((assignee, i) => {
                const selected = selectedAssignees.includes(assignee.id);

                return (
                  <div
                    key={assignee.id}
                    className={`rounded-full ring ${
                      selected ? "ring-blue-600" : "ring-black"
                    } ${i > 0 ? "-ml-6" : ""}`}
                    style={{ zIndex: i }}
                    onClick={() => toggleAssignee(assignee.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={assignee.imageUrl} alt={assignee.name} />
                      <AvatarFallback>
                        {assignee.name ? assignee.name[0] : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                );
              })
            ) : (
              <span className="text-gray-500 text-sm">No Assignees Available</span>
            )}
          </div>
        </div>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
