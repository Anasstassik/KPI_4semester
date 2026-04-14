const { DomainError } = require('./errors');

class Lab {
  constructor({ id, title, description, deadline, disciplineId, status }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.disciplineId = disciplineId;
    this.status = status;
  }

  static create({ title, description, deadline, disciplineId }) {
    const parsedDeadline = new Date(deadline);
    if (parsedDeadline < new Date()) {
      throw new DomainError('Дедлайн не може бути в минулому');
    }

    return new Lab({ 
      title, 
      description,
      deadline: parsedDeadline, 
      disciplineId: parseInt(disciplineId), 
      status: 'До виконання' 
    });
  }

  updateDetails({ title, description, deadline }) {
    if (title) this.title = title;
    if (description) this.description = description;
    
    if (deadline) {
      const parsedDeadline = new Date(deadline);
      if (parsedDeadline < new Date()) {
        throw new DomainError('Новий дедлайн не може бути в минулому');
      }
      this.deadline = parsedDeadline;
    }
  }

  updateStatus(newStatus) {
    const allowed = ['До виконання', 'На перевірці', 'Здано'];
    if (!allowed.includes(newStatus)) {
      throw new DomainError('Некоректний статус');
    }
    this.status = newStatus;
  }
}

module.exports = Lab;