class UpdateLabCommand {
  constructor(id, data, userRole) {
    this.id = id;
    this.title = data.title;
    this.deadline = data.deadline;
    this.userRole = userRole;
  }
}
module.exports = UpdateLabCommand;