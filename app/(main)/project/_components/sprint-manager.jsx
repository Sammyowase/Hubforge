"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSprintStatus } from "@/actions/sprints";

export default function SprintManager({ sprint, setSprint, sprints, projectId }) {
  const [status, setStatus] = useState(sprint.status);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { fn: updateStatus, loading, data: updatedStatus } = useFetch(updateSprintStatus);

  const startDate = useMemo(() => new Date(sprint.startDate), [sprint.startDate]);
  const endDate = useMemo(() => new Date(sprint.endDate), [sprint.endDate]);
  const now = useMemo(() => new Date(), []);

  const canStart = useMemo(
    () => isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED",
    [now, startDate, endDate, status]
  );
  const canEnd = useMemo(() => status === "ACTIVE", [status]);

  useEffect(() => {
    if (updatedStatus?.success && updatedStatus.sprint.status !== status) {
      setStatus(updatedStatus.sprint.status);
      setSprint((prevSprint) => ({ ...prevSprint, status: updatedStatus.sprint.status }));
    }
  }, [updatedStatus, setSprint, status]);

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
        router.replace(`/project/${projectId}`, undefined, { shallow: true });
      }
    }
  }, [searchParams, sprints, sprint.id, setSprint, router, projectId]);

  const handleStatusChange = useCallback(
    (newStatus) => updateStatus(sprint.id, newStatus),
    [sprint.id, updateStatus]
  );

  const handleSprintChange = useCallback(
    (value) => {
      const selectedSprint = sprints.find((s) => s.id === value);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
        router.replace(`/project/${projectId}`, undefined, { shallow: true });
      }
    },
    [sprints, setSprint, router, projectId]
  );

  const getStatusText = useMemo(() => {
    if (status === "COMPLETED") return "Sprint Ended";
    if (status === "ACTIVE" && isAfter(now, endDate)) return `Overdue by ${formatDistanceToNow(endDate)}`;
    if (status === "PLANNED" && isBefore(now, startDate)) return `Starts in ${formatDistanceToNow(startDate)}`;
    return null;
  }, [status, now, startDate, endDate]);

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map(({ id, name, startDate, endDate }) => (
              <SelectItem key={id} value={id}>
                {name} ({format(startDate, "MMM d, yyyy")} to {format(endDate, "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStart && (
          <Button onClick={() => handleStatusChange("ACTIVE")} disabled={loading} className="bg-green-900 text-white">
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button onClick={() => handleStatusChange("COMPLETED")} disabled={loading} variant="destructive">
            End Sprint
          </Button>
        )}
      </div>

      {loading && <BarLoader width="100%" className="mt-2" color="#36d7b7" />}
      {getStatusText && <Badge className="mt-3 ml-1 self-start">{getStatusText}</Badge>}
    </>
  );
}
