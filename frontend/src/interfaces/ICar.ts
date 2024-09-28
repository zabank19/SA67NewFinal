export interface CarInterface {
  ID?: number;
  LicensePlate?: string; // ป้ายทะเบียน
  Province?: string; // จังหวัด
  Brands?: string; // แบรนด์
  Models?: string; // รุ่น
  ModelYear?: string; // ปีที่ผลิต
  Color?: string; // สี
  VIN?: string; // หมายเลขการระบุรถยนต์
  VRN?: string; // หมายเลขทะเบียนรถ
  Status?: string; // สถานะ
  Type?: string; // ประเภท
  Price?: number; // ราคา
  Picture?: string; // รูปภาพ (แบบยาว)
}
