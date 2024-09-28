import { useEffect, useState } from "react";
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
  Upload,
  Image,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../interfaces/IUser";
import { CreateUser } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { RcFile } from "antd/es/upload/interface";

const { Option } = Select;

function CreateEmployee() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>(undefined);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onFinish = async (values: UsersInterface) => {
    const age = calculateAge(values.birthday ? values.birthday.toDate() : null);
    let payload = {
      ...values,
      age: age,
      picture: image, // เพิ่มรูปภาพลงใน payload
    };

    console.log("Payload:", payload);

    try {
      let res = await CreateUser(payload);

      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: "สร้างสำเร็จ",
        });
        setTimeout(() => {
          navigate("/employee");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    }
  };

  const handleImageUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent the default upload behavior
  };

  const handleUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string); // กำหนดรูปภาพที่อัพโหลด
    };
    reader.readAsDataURL(file);
    return false; // ป้องกันไม่ให้มีการอัพโหลดอัตโนมัติ
  };

  return (
    <div>
      {contextHolder}
      <Card style={{ maxWidth: "80%", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>เพิ่มข้อมูลพนักงาน</h2>
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
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>ชื่อจริง</span>}
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input style={{ fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>นามสกุล</span>}
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input style={{ fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>ตำแหน่ง</span>}
                name="roles"
                rules={[{ required: true, message: "กรุณากรอกตำแหน่ง!" }]}
              >
                <Select style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }}>
                  <Option value={0}>Admin</Option>
                  <Option value={2}>Employee</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>วัน/เดือน/ปี เกิด</span>}
                name="birthday"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
              >
                <DatePicker style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>เพศ</span>}
                name="gender_id"
                rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
              >
                <Select
                  defaultValue=""
                  style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }}
                  options={[
                    { value: "", label: "กรุณาเลือกเพศ", disabled: true },
                    { value: 1, label: "Male" },
                    { value: 2, label: "Female" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>อีเมล</span>}
                name="email"
                rules={[
                  { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                  { required: true, message: "กรุณากรอกอีเมล !" },
                ]}
              >
                <Input style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>ที่อยู่</span>}
                name="address"
                rules={[{ required: true, message: "กรุณากรอกที่อยู่ !" }]}
              >
                <Input.TextArea rows={1} style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>เบอร์โทรศัพท์</span>}
                name="phone"
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทร !" }]}
              >
                <Input style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>รหัสผ่าน</span>}
                name="password"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
              >
                <Input.Password style={{ width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #003366" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: "16px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>รูปภาพ</span>}
                name="picture"
                rules={[{ required: true, message: "กรุณาอัปโหลดรูปภาพ !" }]} // ตรวจสอบรูปภาพที่อัปโหลด
              >
                <Upload
                  customRequest={({ file, onSuccess }) => {
                    handleImageUpload(file as RcFile);
                    onSuccess?.();
                  }}
                  showUploadList={false}
                >
                  <Button
                    
                    style={{
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #003366",
                      backgroundColor: "#003366",
                      color: "#FFD700",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FFD700")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#003366")}
                  >
                    Upload
                  </Button>
                </Upload>

                {image && (
                  <div style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px solid #003366',
                    overflow: 'hidden',
                  }}>
                    <Image
                      width={300}
                      height={200}
                      src={image}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            </Row>
            <Row justify="end" style={{ marginTop: "50px", marginLeft: "350px"}}>
              <Col >
                <Form.Item>
                  <Space>
                    <Link to="/employee">
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
                        ยกเลิก
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
                      เพิ่มพนักงาน
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

export default CreateEmployee;
