export interface ReviewInterface {
    ID?: number;
    Score?: number;   // คะแนนรีวิว
    Comment?: string; // ความคิดเห็น
    Reply?: string;  // การตอบกลับ
    TimeComment?: Date; // เวลาที่แสดงความคิดเห็น
    TimeEdit?: Date;  // เวลาที่แก้ไข
    UserID?: number;   // เชื่อมกับผู้ใช้
  }
  