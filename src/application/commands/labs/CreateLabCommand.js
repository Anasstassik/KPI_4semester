class CreateLabCommand {
  constructor(data, userRole) {
    this.title = data.title;
    this.deadline = data.deadline;
    this.disciplineId = data.disciplineId;
    this.userRole = userRole;
  }
}
module.exports = CreateLabCommand;