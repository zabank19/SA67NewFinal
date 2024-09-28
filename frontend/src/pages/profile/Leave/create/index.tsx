import React, { useEffect, useState } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { LeaveInterface } from "../../../../interfaces/ILeave";
import {CreateLeave } from "../../../../services/https"; // ฟังก์ชันในการสร้างการลา
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

function CreateLeaves()  {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [userId, setUserId] = useState<number | null>(null); // State สำหรับเก็บ ID ของผู้ใช้ที่เข้าสู่ระบบ
  
    useEffect(() => {
      // ดึงข้อมูล user_id จาก localStorage หรือ context ที่ใช้ในการเข้าสู่ระบบ
      const storedUserId = localStorage.getItem("id");
      if (storedUserId) {
        setUserId(parseInt(storedUserId)); // เก็บ user_id
      } else {
        messageApi.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง");
        navigate("/signin"); // เปลี่ยนเส้นทางไปยังหน้า Sign In หากไม่พบข้อมูลผู้ใช้
      }
    }, [navigate, messageApi]);
  
    const onFinish = async (values: LeaveInterface) => {
      if (!userId) {
        messageApi.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง");
        return;
      }
  
      let payload = {
        ...values,
        user_id: userId,
        status: 'pending',
      };
  
      let res = await CreateLeave(payload); // ส่งข้อมูลไปยัง API
  
      if (res.status === 201) {
        messageApi.success("สร้างการลาเรียบร้อย");
        setTimeout(() => {
          navigate("/profile/leave");
        }, 2000);
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลการลา");
      }
    };
  
    return (
      <div style={{ fontFamily: 'Kanit, sans-serif', padding: '20px' }}>
        {contextHolder}
        <Card style={{ maxWidth: "80%", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>เพิ่มข้อมูลการลา</h2>
          <Divider />
          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วันที่"
                  name="day"
                  rules={[{ required: true, message: "กรุณาเลือกวันที่ !" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="คำอธิบาย"
                  name="description"
                  rules={[{ required: true, message: "กรุณากรอกคำอธิบาย !" }]}
                >
                  <Input.TextArea rows={4} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/profile/Leave">
                      <Button
                        htmlType="button"
                        style={{
                          marginRight: "10px",
                          fontSize: "16px",
                          backgroundColor: "#FFD700",
                          borderColor: "#FFD700",
                          color: "#003366",
                          borderRadius: "8px",
                        }}
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<PlusOutlined />}
                      style={{
                        fontSize: "16px",
                        backgroundColor: "#003366",
                        borderColor: "#003366",
                        borderRadius: "8px",
                      }}
                    >
                      เพิ่มการลา
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
  
  export default CreateLeaves;
  