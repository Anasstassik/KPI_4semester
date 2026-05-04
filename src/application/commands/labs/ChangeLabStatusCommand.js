class ChangeLabStatusCommand {
  constructor(id, status, userRole) {
    this.id = id;
    this.status = status;
    this.userRole = userRole;
  }
}
module.exports = ChangeLabStatusCommand;