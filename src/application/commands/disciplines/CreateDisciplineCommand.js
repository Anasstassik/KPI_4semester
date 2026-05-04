class CreateDisciplineCommand {
  constructor({ name }, userRole) {
    this.name = name;
    this.userRole = userRole;
  }
}

module.exports = CreateDisciplineCommand;
