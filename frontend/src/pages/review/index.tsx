import { useEffect } from "react";
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
  InputNumber,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ReviewInterface } from "../../interfaces/IReview";
import { GetReviewById, UpdateReviewById, CreateReview } from "../../services/https";
import { useNavigate, useParams } from "react-router-dom";

function Review() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>(); // รับ rent ID จาก URL แทน user ID
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  
  const userId = localStorage.getItem("id"); // ดึง user_id จาก localStorage

  // ฟังก์ชันดึงข้อมูลรีวิวจาก API โดยใช้ rent_id
  const getReviewById = async (id: string) => {
    try {
      const response = await GetReviewById(id); // ดึงข้อมูลรีวิวโดยใช้ rent_id

      if (!response || response.status === 404 || Object.keys(response).length === 0) {
        // ถ้าไม่เจอรีวิว ให้ลองหา id - 1 แทน
        const newId = parseInt(id) - 1;
        const newResponse = await GetReviewById(newId.toString());
        if (!newResponse || newResponse.status === 404 || Object.keys(newResponse).length === 0) {
          form.setFieldsValue({
            comment: '',
            score: 0,
          });
          messageApi.open({
            type: "info",
            content: "ยังไม่มีรีวิว คุณสามารถเพิ่มรีวิวได้",
          });
        } else {
          form.setFieldsValue({
            comment: newResponse.comment,
            score: newResponse.score,
          });
        }
      } else {
        form.setFieldsValue({
          comment: response.comment,
          score: response.score,
        });
      }
    } catch (error) {
      console.error("Error fetching review data:", error);
      form.setFieldsValue({
        comment: '',
        score: 0,
      });
      messageApi.open({
        type: "info",
        content: "ยังไม่มีรีวิว คุณสามารถเพิ่มรีวิวใหม่ได้",
      });
    }
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูลรีวิว
  const onFinish = async (values: ReviewInterface) => {
    const payload = {
      ...values,
      rent_id: parseInt(id), // ตรวจสอบให้แน่ใจว่า rent_id เป็น number หรือ uint
      user_id: parseInt(localStorage.getItem("id") ?? "0"), // ตรวจสอบให้แน่ใจว่า user_id เป็น number หรือ uint
    };

    try {
      const reviewExists = await GetReviewById(id);

      if (reviewExists && reviewExists.comment !== "") {
        await UpdateReviewById(id, payload); // อัปเดตถ้ามีรีวิวแล้ว
      } else {
        await CreateReview(payload); // สร้างรีวิวใหม่ถ้ายังไม่มี
      }

      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });

      // เปลี่ยนเส้นทางไปยังหน้า reviewall หลังจากบันทึกสำเร็จ
      setTimeout(() => {
        navigate(`/reviewall`);
      }, 2000); // รอ 2 วินาทีก่อนนำทางไปยังหน้า reviewall

    } catch (error) {
      console.error("Error during saving review:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    }
  };

  // ฟังก์ชันลบข้อมูลรีวิว
  const handleDelete = async () => {
    const payload: Partial<ReviewInterface> = {
      comment: "",
      score: 0,
      reply: "",
    };

    if (!id) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด: ไม่พบ ID",
      });
      return;
    }

    try {
      await UpdateReviewById(id, payload); // ลบข้อมูลรีวิวโดยเชื่อมกับ rent_id

      messageApi.open({
        type: "success",
        content: "ลบความคิดเห็นสำเร็จ",
      });

      // เปลี่ยนเส้นทางไปยังหน้า history ของตนเองหลังจากลบสำเร็จ
      setTimeout(() => {
        navigate(`/history/${userId}`);
      }, 2000);

    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };

  // เรียกฟังก์ชันดึงข้อมูลรีวิวเมื่อหน้าโหลด โดยใช้ rent_id
  useEffect(() => {
    if (id) {
      getReviewById(id);
    }
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แสดงความคิดเห็น</h2>
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
              <Form.Item label="ความคิดเห็น" name="comment">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="คะแนน" name="score">
                <InputNumber
                  min={0}
                  max={5}
                  defaultValue={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  {/* ปุ่มยกเลิก นำกลับไปยัง history */}
                  <Button
                    htmlType="button"
                    style={{ marginRight: "10px" }}
                    onClick={() => navigate(`/history/${userId}`)} // กลับไปหน้า history ของตนเองเมื่อกด "ยกเลิก"
                  >
                    ยกเลิก
                  </Button>

                  {/* ปุ่มบันทึก */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    บันทึก
                  </Button>

                  {/* ปุ่มลบ */}
                  <Popconfirm
                    title="ยืนยันการลบ?"
                    onConfirm={handleDelete}
                    okText="ใช่"
                    cancelText="ยกเลิก"
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      ลบ
                    </Button>
                  </Popconfirm>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default Review;
