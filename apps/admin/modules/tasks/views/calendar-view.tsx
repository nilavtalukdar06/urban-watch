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
import { EventCard } from "../components/event-card";
import { Toolbar } from "../components/toolbar";

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

type Event = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  resource: Task;
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

const mapTaskToEvents = (tasks: Task[]): Event[] => {
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
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState(
    events.length > 0 && events[0]?.end ? new Date(events[0].end) : new Date(),
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
      <div className="h-[800px] w-full my-2">
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
          components={{
            eventWrapper: ({ event }) => {
              return (
                <div className="w-full px-1">
                  <EventCard
                    end={event.end}
                    title={event.title}
                    start={event.start}
                    resource={event.resource}
                  />
                </div>
              );
            },
            toolbar: () => {
              return <Toolbar date={value} onNavigate={handleNavigate} />;
            },
          }}
        />
      </div>
    );
  }
  return null;
}
