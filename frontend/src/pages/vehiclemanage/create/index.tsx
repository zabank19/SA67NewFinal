import { useState } from "react";
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
  Upload,
  Image,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CarInterface } from "../../../interfaces/ICar";
import { CreateCar } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { RcFile } from "antd/es/upload/interface";

const { Option } = Select;

function CarCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>(undefined);

  const onFinish = async (values: CarInterface) => {
    let payload = {
      ...values,
      picture: image, // use the base64 image
    };

    let res = await CreateCar(payload);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: "สร้างข้อมูลสำเร็จ",
      });

      setTimeout(() => {
        navigate("/vehiclemanage");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.error,
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

  return (
    <div style={{ fontFamily: 'Kanit, sans-serif', padding: '20px' }}>
      {contextHolder}
      <Card style={{ maxWidth: '80%', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เพิ่มข้อมูลรถ</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ทะเบียนรถ</span>}
                name="license_plate"
                rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>จังหวัด</span>}
                name="province"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ยี่ห้อ</span>}
                name="brands"
                rules={[{ required: true, message: "กรุณากรอกยี่ห้อ!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>รุ่น</span>}
                name="models"
                rules={[{ required: true, message: "กรุณากรอกรุ่น!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ปี</span>}
                name="model_year"
                rules={[{ required: true, message: "กรุณากรอกปี!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>สี</span>}
                name="color"
                rules={[{ required: true, message: "กรุณากรอกสี!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เลขตัวรถ</span>}
                name="vehicle_identification_number"
                rules={[{ required: true, message: "กรุณากรอกเลขตัวรถ!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เลขที่ รย.</span>}
                name="vehicle_registration_number"
                rules={[{ required: true, message: "กรุณากรอกเลขที่ รย.!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>สถานะการใช้งาน</span>}
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกสถานะการใช้งาน!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Select
                  placeholder="เลือกสถานะ"
                  style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }}
                >
                  <Option value="พร้อมใช้งาน">พร้อมใช้งาน</Option>
                  <Option value="งดใช้งานชั่วคราว">งดใช้งานชั่วคราว</Option>
                  <Option value="อยู่ระหว่างซ่อม">อยู่ระหว่างซ่อม</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เลือกประเภทรถ</span>}
                name="type"
                rules={[{ required: true, message: "กรุณาเลือกประเภทรถ!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Select
                  placeholder="เลือกประเภทรถ"
                  style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }}
                >
                  <Option value="Eco car">Eco car</Option>
                  <Option value="Van">Van</Option>
                  <Option value="Motorcycle">Motorcycle</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ราคา/วัน</span>}
                name="price"
                rules={[{ required: true, message: "กรุณากรอกราคา/วัน!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>รูปภาพ</span>}
                name="picture"
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
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #003366',
                      backgroundColor: '#003366',
                      color: '#FFD700',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FFD700')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#003366')}
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
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
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/vehiclemanage">
                    <Button
                      htmlType="button"
                      style={{
                        marginRight: "10px",
                        fontSize: '16px',
                        backgroundColor: '#FFD700',
                        borderColor: '#FFD700',
                        color: '#003366',
                        borderRadius: '8px',
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
                      fontSize: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#003366',
                      borderColor: '#003366',
                    }}
                  >
                    Done
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

export default CarCreate;