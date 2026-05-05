export interface IAuditService {
  log(event: string, data: any): void;
}

export class AuditService implements IAuditService {
  log(event: string, data: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT][${timestamp}] Event: ${event}`, data);
  }
}
