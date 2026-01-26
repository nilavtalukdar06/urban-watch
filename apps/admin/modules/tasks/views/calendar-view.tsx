"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Task = {
  title: string;
  description: string;
  assignedToUserId: string;
  assignedByUserId: string;
  status: string;
  organizationId: string;
  dueDate: number;
  _id: string;
  _creationTime: number;
};

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const mapTaskToEvents = (tasks: Task[]) => {
  return tasks.map((task) => {
    const due = new Date(task.dueDate);
    return {
      id: task._id,
      start: due,
      end: due,
      title: task.title,
      allDay: true,
      resource: task,
    };
  });
};

export function CalendarView(props: {
  preloadedTasks: Preloaded<typeof api.functions.tasks.getTasks>;
}) {
  const [events, setEvents] = useState<any>([]);
  const tasks = usePreloadedQuery(props.preloadedTasks);
  useEffect(() => {
    if (tasks) {
      const result = mapTaskToEvents(tasks);
      setEvents(result);
    }
  }, [tasks]);
  if (events) {
    return (
      <div className="my-3 h-[700px] w-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          defaultView="month"
          toolbar={true}
          selectable={false}
          popup
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    );
  }
  return null;
}
