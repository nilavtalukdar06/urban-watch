"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
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
  const [value, setValue] = useState(
    events.length > 0 ? new Date(events[0].dueDate) : new Date(),
  );
  const tasks = usePreloadedQuery(props.preloadedTasks);
  useEffect(() => {
    if (tasks) {
      const result = mapTaskToEvents(tasks);
      setEvents(result);
    }
  }, [tasks]);

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };
  if (events) {
    return (
      <div className="my-3 h-[700px] w-full">
        <Calendar
          localizer={localizer}
          date={value}
          events={events}
          views={["month"]}
          defaultView="month"
          toolbar={true}
          showAllEvents={true}
          style={{ height: "100%", width: "100%" }}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          formats={{
            weekdayFormat: (date, culture, localizer) =>
              localizer?.format(date, "EEE", culture) ?? "",
          }}
        />
      </div>
    );
  }
  return null;
}
