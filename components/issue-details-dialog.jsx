"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import statuses from "@/data/status";
import { deleteIssue, updateIssue } from "@/actions/issues";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  borderCol = "",
}) {
  const { id, title, status: issueStatus, priority: issuePriority, 
          description, reporter, assignee, projectId, sprintId } = issue;

  const [status, setStatus] = useState(issueStatus);
  const [priority, setPriority] = useState(issuePriority);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const isProjectPage = !pathname.startsWith("/project/");
  const canChange = useMemo(
    () => user.id === reporter.clerkUserId || membership.role === "org:admin",
    [user.id, reporter.clerkUserId, membership.role]
  );

  // Ensure stability of callbacks
  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(id);
    }
  }, [deleteIssueFn, id]);

  const handleStatusChange = useCallback(
    (newStatus) => {
      if (newStatus !== status) { // Prevent unnecessary state updates
        setStatus(newStatus);
        updateIssueFn(id, { status: newStatus, priority });
      }
    },
    [updateIssueFn, id, priority, status]
  );

  const handlePriorityChange = useCallback(
    (newPriority) => {
      if (newPriority !== priority) { // Prevent unnecessary state updates
        setPriority(newPriority);
        updateIssueFn(id, { status, priority: newPriority });
      }
    },
    [updateIssueFn, id, status, priority]
  );

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
  }, [deleted, onClose, onDelete]);

  useEffect(() => {
    if (updated && updated !== issue) { // Avoid unnecessary updates
      onUpdate(updated);
    }
  }, [updated, onUpdate, issue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/project/${projectId}?sprint=${sprintId}`)}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {(updateLoading || deleteLoading) && (
          <BarLoader width="100%" color="#36d7b7" />
        )}

        <div className="space-y-4">
          {/* Status and Priority */}
          <div className="flex items-center space-x-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(({ key, name }) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={handlePriorityChange} disabled={!canChange}>
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown className="rounded px-2 py-1" source={description || "--"} />
          </div>

          {/* Assignee and Reporter */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={assignee} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={reporter} />
            </div>
          </div>

          {/* Delete Button */}
          {canChange && (
            <Button onClick={handleDelete} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}

          {/* Error Messages */}
          {(deleteError || updateError) && (
            <p className="text-red-500">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
