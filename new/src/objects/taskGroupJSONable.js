export class TaskGroupJSONable {
  // id is number
  // name is string
  // tasks is a TaskJSONable array
  // pax is a number
  constructor(id, name, tasks, pax) {
    this.id = id;
    this.name = name;
    this.tasks = tasks;
    this.pax = pax;
  }
  toString() {
    let out = "Task Group JSON " + this.name + ":\n";
    for (const task of this.tasks) {
      out += task.toString();
    }
    return out;
  }
}
