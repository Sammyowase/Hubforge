"use client";

import { useEffect, useCallback } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    if (isOpen && orgId && !users?.length) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId, users?.length]); // Added users?.length to prevent unnecessary fetches

  const onSubmit = useCallback(
    async (data) => {
      try {
        await createIssueFn(projectId, {
          ...data,
          status,
          sprintId,
        });
      } catch (error) {
        console.error("Error creating issue:", error);
        alert("Failed to create issue. Please try again.");
      }
    },
    [createIssueFn, projectId, status, sprintId]
  );

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen && onIssueCreated) {
      onIssueCreated();
    }
  }, [isOpen, onIssueCreated]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <Input id="title" {...register("title")} placeholder="Title" />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users?.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <Button type="submit" disabled={createIssueLoading}>
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
