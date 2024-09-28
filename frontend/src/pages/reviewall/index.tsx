import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Rate, Button, Modal, Form, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { GetRents, GetUsers, GetCars, GetReviews, UpdateReviewById } from '../../services/https';
import { RentInterface } from '../../interfaces/IRent';
import { UserInterface } from '../../interfaces/IUser';
import { CarInterface } from '../../interfaces/ICar';
import { ReviewInterface } from '../../interfaces/IReview';
import dayjs from 'dayjs';
import './ReviewAll.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '36px',
    fontFamily: 'Kanit, sans-serif',
  },
  table: {
    marginTop: '20px',
  },
  reviewTotal: {
    fontSize: '20px',
    fontFamily: 'Kanit, sans-serif',
    color: '#000000',
  },
  replyButton: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    color: '#fff',
  },
  replyText: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#555555',
  },
};

const ReviewAll = ({ roles }) => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [rents, setRents] = useState<RentInterface[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchCars();
    fetchRents();
    fetchReviews();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await GetUsers();
      setUsers(response);
    } catch (error) {
      message.error('Failed to fetch user data');
    }
  };

  const fetchCars = async () => {
    try {
      const response = await GetCars();
      setCars(response);
    } catch (error) {
      message.error('Failed to fetch car data');
    }
  };

  const fetchRents = async () => {
    try {
      const response = await GetRents();
      setRents(response);
    } catch (error) {
      message.error('Failed to fetch rent data');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await GetReviews();
      // กรองข้อมูลรีวิวเฉพาะที่มี comment หรือ score
      const filteredReviews = response.filter((review: ReviewInterface) => review.comment || review.score);
      setReviews(filteredReviews);
    } catch (error) {
      message.error('Failed to fetch review data');
    }
  };


  const getUserName = (userID: number) => {
    const user = users.find(u => u.ID === userID);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const getCarDetails = (carID: number) => {
    const car = cars.find(c => c.ID === carID);
    return car ? (
      <>
        {car.models} <br /> {car.license_plate}, {car.province}
      </>
    ) : 'Unknown';
  };

  const getCommentByRentId = (rentID: number) => {
    const review = reviews.find(r => r.rent_id === rentID);
    return review ? review.comment : '-';
  };

  const getScoreByRentId = (rentID: number) => {
    const review = reviews.find(r => r.rent_id === rentID);
    return review ? review.score : '-';
  };

  const getTimeCommentByRentId = (rentID: number) => {
    const review = reviews.find(r => r.rent_id === rentID);
    return review ? dayjs(review.timecomment).format('YYYY-MM-DD HH:mm') : '-';
  };

  const getReplyByRentId = (rentID: number) => {
    const review = reviews.find(r => r.rent_id === rentID);
    return review && review.reply ? review.reply : '-';
  };

  // เมื่อกดที่ Reply จะแสดงข้อมูลของ review ที่ตอบไปแล้ว (ถ้ามี)
  const handleReply = (reviewId: number) => {
    const review = reviews.find(r => r.rent_id === reviewId);
    if (review && review.reply) {
      form.setFieldsValue({ reply: review.reply }); // ตั้งค่าฟอร์มเป็น reply ที่มีอยู่
    } else {
      form.resetFields(); // ถ้าไม่มี reply ให้ล้างฟอร์ม
    }
    setCurrentReviewId(reviewId);
    setIsModalVisible(true);
  };

  const handleReplySubmit = async (values: any) => {
    if (currentReviewId === null) return;

    try {
      await UpdateReviewById(currentReviewId, { reply: values.reply });
      message.success('Reply added successfully');
      setIsModalVisible(false);
      fetchReviews();
    } catch (error) {
      message.error('Failed to add reply');
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userID: number) => getUserName(userID),
    },
    {
      title: 'Car Details',
      dataIndex: 'car_id',
      key: 'car_id',
      render: (carID: number) => getCarDetails(carID),
    },
    {
      title: 'Comment',
      key: 'comment_reply',
      render: (record: RentInterface) => {
        const comment = getCommentByRentId(record.ID!);
        const reply = getReplyByRentId(record.ID!);
        return (
          <>
            <div>{comment}</div>
            {reply !== '-' && <div style={styles.replyText}>Reply: {reply}</div>}
          </>
        );
      },
    },
    {
      title: 'Score',
      key: 'score',
      render: (record: RentInterface) => <Rate disabled defaultValue={getScoreByRentId(record.ID!)} allowHalf />,
    },
    {
      title: 'Time Comment',
      key: 'time_comment',
      render: (record: RentInterface) => getTimeCommentByRentId(record.ID!),
    },
  ];
  
  if (roles !== 1) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (record: RentInterface) => (
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => handleReply(record.ID!)}
          style={styles.replyButton}
        >
          Reply
        </Button>
      ),
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <Title level={1} style={styles.headerTitle}>Reviews</Title>
        <Text style={styles.reviewTotal}>
          Review total: {reviews.length}
        </Text>
      </div>
      <Table
        dataSource={rents.filter((rent) => {
          const review = reviews.find(r => r.rent_id === rent.ID);
          return review && (review.comment || review.score); // กรองเฉพาะรายการที่มี comment หรือ score
        })}
        columns={columns}
        rowKey="ID"
        style={styles.table}
      />


      <Modal
        title="Reply to Comment"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReplySubmit}>
          <Form.Item
            name="reply"
            rules={[{ required: true, message: 'Please enter your reply' }]}
          >
            <TextArea rows={4} placeholder="Enter your reply..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewAll;
