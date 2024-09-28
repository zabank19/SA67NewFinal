export interface LeaveInterface {
    status: 'pending' | 'approved' | 'rejected';
    ID?: number;
    Description?: string;
    Day?: string;
    userId: number;
  }
  