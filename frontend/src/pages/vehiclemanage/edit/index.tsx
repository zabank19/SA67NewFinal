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
  Typography,
  Upload,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CarInterface } from "../../../interfaces/ICar";
import { GetCarById, UpdateCarById } from "../../../services/https";
import { useNavigate, Link, useParams } from "react-router-dom";
import { RcFile } from "antd/es/upload/interface";

const { Title } = Typography;
const { Option } = Select;

function CarEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>();

  const getCarById = async (id: string) => {
    try {
      const res = await GetCarById(id);
      if (res.ID) {
        form.setFieldsValue({
          license_plate: res.license_plate,
          province: res.province,
          brands: res.brands,
          models: res.models,
          model_year: res.model_year,
          color: res.color,
          vehicle_identification_number: res.vehicle_identification_number,
          vehicle_registration_number: res.vehicle_registration_number,
          picture: res.picture,
          status: res.status,
          price: res.price,
        });
        setImage(res.picture);
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลรถ",
        });
        setTimeout(() => {
          navigate("/vehiclemanage");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลรถ",
      });
    }
  };

  const onFinish = async (values: CarInterface) => {
    let payload = {
      ...values,
      price: parseFloat(values.price),
      picture: image, // use the base64 image
    };

    const res = await UpdateCarById(id, payload);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });

      setTimeout(() => {
        navigate("/vehiclemanage");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    }
  };

  useEffect(() => {
    if (id) {
      getCarById(id);
    }
  }, [id]);

  const handleImageUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent the default upload behavior
  };

  return (
    <div
      style={{
        fontFamily: "Kanit, sans-serif",
        padding: "20px",
        width: "80%",
        margin: "0 auto", // Center the component
      }}
    >
      {contextHolder}
      <Card>
        <Title level={2} style={{ fontSize: "24px", color: "#003366", fontFamily: "Kanit, sans-serif" }}>
          แก้ไขข้อมูลรถ
        </Title>
        <Divider />
        <Row justify="center">
          <Col>
            {image && (
              <div
                style={{
                  width: "300px",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #003366",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={image}
                  alt="Car"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
        <Form name="basic" form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ทะเบียนรถ</span>}
                name="license_plate"
                rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>จังหวัด</span>}
                name="province"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ยี่ห้อ</span>}
                name="brands"
                rules={[{ required: true, message: "กรุณากรอกยี่ห้อ!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>รุ่น</span>}
                name="models"
                rules={[{ required: true, message: "กรุณากรอกรุ่น!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ปี</span>}
                name="model_year"
                rules={[{ required: true, message: "กรุณากรอกปี!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>สี</span>}
                name="color"
                rules={[{ required: true, message: "กรุณากรอกสี!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เลขตัวรถ</span>}
                name="vehicle_identification_number"
                rules={[{ required: true, message: "กรุณากรอกเลขตัวรถ!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>เลขที่ รย.</span>}
                name="vehicle_registration_number"
                rules={[{ required: true, message: "กรุณากรอกเลขที่ รย.!" }]}
              >
                <Input style={{ fontSize: '16px', borderRadius: '8px', border: '1px solid #003366' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>สถานะการใช้งาน</span>}
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกสถานะการใช้งาน!" }]}
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
                label={<span style={{ fontSize: '16px', color: '#003366', fontFamily: 'Kanit, sans-serif' }}>ราคา/วัน.</span>}
                name="price"
                rules={[{ required: true, message: "กรุณากรอกราคา/วัน!" }]}
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
                      borderRadius: "8px",
                      backgroundColor: "#003366",
                      borderColor: "#003366",
                    }}
                  >
                    Save
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

export default CarEdit;
