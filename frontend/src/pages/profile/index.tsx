import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { UsersInterface } from "../../interfaces/IUser";
import { GetUsers } from "../../services/https/index";
import dayjs from "dayjs";

const { Title } = Typography;

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #003366',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    color: '#003366',
    fontFamily: 'Kanit, sans-serif',
  },
  inputStyle: {
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #003366',
  },
  imageContainer: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '2px solid #003366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#003366',
  },
  button: {
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
};

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const myId = localStorage.getItem("id");

  const handleEditProfile = () => {
    if (myId) {
      navigate(`/profile/edit/${myId}`);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบ ID ผู้ใช้",
      });
    }
  };

  const getUserById = async (id: string) => {
    try {
      const res = await GetUsers();
      const userData = res.find(user => user.ID === Number(id));
      if (userData) {
        setUser(userData);
        form.setFieldsValue({
          first_name: userData.first_name,
          last_name: userData.last_name,
          age: userData.age,
          birthday: userData.birthday ? dayjs(userData.birthday).format("DD/MM/YYYY") : '',
          email: userData.email,
          roles: userData.roles === 0 ? "Admin" : userData.roles === 1 ? "User" : "Employee",
          gender: userData.gender_id === 1 ? 'Male' : 'Female',
          phone: userData.phone,
          address: userData.address,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลผู้ใช้",
        });
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      });
    }
  };

  useEffect(() => {
    if (myId) {
      getUserById(myId);
    }
  }, [myId]);

  if (!user) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div style={styles.container}>
      {contextHolder}
      <Card>
        <Title level={2} style={styles.title}>ข้อมูลผู้ใช้</Title>
        <Divider />
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <Col>
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #003366' }}
              />
            ) : (
              <div style={styles.imageContainer}>No Image</div>
            )}
          </Col>
        </Row>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="ชื่อ" name="first_name">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="นามสกุล" name="last_name">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="ตำแหน่ง" name="roles">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="เพศ" name="gender">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="อายุ" name="age">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="เบอร์โทรศัพท์" name="phone">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="ที่อยู่" name="address">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="วัน/เดือน/ปี เกิด" name="birthday">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="อีเมล" name="email">
                <Input style={styles.inputStyle} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={handleEditProfile}
                    style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                  >
                    Edit
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            {(user.roles === 0 || user.roles === 2) && (
              <Col style={{ marginTop: "40px", marginLeft: "20px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/profile/leave">
                      <Button type="primary" style={styles.button}>ลางาน</Button>
                    </Link>
                  </Space>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default ProfilePage;
