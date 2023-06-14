import { DateTime } from "luxon";
import { TaskJSONable } from "./taskJSONable";

export class Task {
  // task_id is a number
  // interval is a Luxon Interval
  // user_id is a number
  // isCompleted is a boolean
  // proj_id is a number
  // task_priority is a number
  // group_id is a number
  // isAssigned is a boolean
  constructor(
    task_id,
    interval,
    user_id,
    isCompleted,
    proj_id,
    task_priority,
    group_id,
    isAssigned
  ) {
    this.task_id = task_id;
    this.interval = interval;
    this.user_id = user_id;
    this.isCompleted = isCompleted;
    this.proj_id = proj_id;
    this.task_priority = task_priority;
    this.group_id = group_id;
    this.isAssigned = isAssigned;
  }
  getInterval() {
    return this.interval.toLocaleString(DateTime.DATETIME_MED);
  }
  getTimeNeeded() {
    return Math.round(this.interval.toDuration("minutes").toObject().minutes);
  }
  toString() {
    var out = "Task: " + "\n";
    out += "Interval: " + this.getInterval() + "\n";
    out += "Time needed: " + this.getTimeNeeded() + "\n";
    return out;
  }
  toJSONable() {
    const outInterval = this.interval.toISO({ suppressSeconds: true });
    return new TaskJSONable(
      this.task_id,
      outInterval,
      this.user_id,
      this.isCompleted,
      this.proj_id,
      this.task_priority,
      this.group_id,
      this.isAssigned
    );
  }
  static fromJSONable(object) {
    const outInterval = Interval.fromISO(object.interval);
    return new Task(
      this.task_id,
      outInterval,
      this.user_id,
      this.isCompleted,
      this.proj_id,
      this.task_priority,
      this.group_id,
      this.isAssigned
    );
  }
}
