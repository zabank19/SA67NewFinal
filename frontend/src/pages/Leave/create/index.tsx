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
import { UsersInterface } from "../../../interfaces/IUser";
import { LeaveInterface } from "../../../interfaces/ILeave";
import { GetUsers, CreateLeave } from "../../../services/https"; // ฟังก์ชันในการสร้างการลา
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

function CreateLeavePage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UsersInterface[]>([]); // State สำหรับเก็บข้อมูลผู้ใช้

  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้
  const fetchUsers = async () => {
    try {
      const response = await GetUsers();
      // กรองเฉพาะผู้ใช้ที่มี role = 0 หรือ 1
      const filteredUsers = response.filter((user: UsersInterface) => user.roles === 0 || user.roles === 2);
      setUsers(filteredUsers);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = async (values: LeaveInterface) => {
    let payload = {
      ...values,
      status: "pending", // สถานะเริ่มต้น
    };

    let res = await CreateLeave(payload); // ส่งข้อมูลไปยัง API

    if (res.status === 201) { // ตรวจสอบสถานะการตอบกลับ
      messageApi.open({
        type: "success",
        content: "สร้างการลาเรียบร้อย",
      });
      setTimeout(() => {
        navigate("/leave"); // เปลี่ยนเส้นทางไปยังหน้า leave
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูลการลา",
      });
    }
  };

  return (
    <div style={{ fontFamily: 'Kanit, sans-serif', padding: '20px' }}>
      {contextHolder}
      <Card style={{ maxWidth: "80%", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>เพิ่มข้อมูลการลา</h2>
        <Divider />

        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>ผู้ใช้</span>}
                name="user_id"
                rules={[{ required: true, message: "กรุณาเลือกผู้ใช้ !" }]}
              >
                <Select style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }}>
                  {users.map(user => (
                    <Option key={user.ID} value={user.ID}>
                      {`${user.first_name} ${user.last_name}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>วันที่</span>}
                name="day"
                rules={[{ required: true, message: "กรุณาเลือกวันที่ !" }]}
              >
                <DatePicker style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>คำอธิบาย</span>}
                name="description"
                rules={[{ required: true, message: "กรุณากรอกคำอธิบาย !" }]}
              >
                <Input.TextArea rows={4} style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/Leave">
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

export default CreateLeavePage;
