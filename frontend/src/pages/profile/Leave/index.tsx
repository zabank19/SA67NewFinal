import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, message, Modal, Form, Input, DatePicker, Space, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GetLeaves, UpdateLeaveById, DeleteLeaveById, GetUsers } from '../../../services/https';
import { LeaveInterface } from '../../../interfaces/ILeave';
import { UsersInterface } from '../../../interfaces/IUser';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

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
  headerTitle: {
    fontSize: '36px',
    fontFamily: 'Kanit, sans-serif',
  },
  addButton: {
    fontSize: '16px',
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    fontFamily: 'Kanit, sans-serif',
    marginBottom: '20px',
  },
  table: {
    marginTop: '20px',
  },
  editButton: {
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    border: 'none',
    color: '#ffffff',
  },
};

const LeavePageId = () => {
  const [leaves, setLeaves] = useState<LeaveInterface[]>([]);
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentLeaveRequest, setCurrentLeaveRequest] = useState<LeaveInterface | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchLeaves();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await GetUsers();
      setUsers(response);
    } catch (error) {
      if (error.response) {
        message.error(`Error fetching users: ${error.response.data.message}`);
      } else {
        message.error('Network error. Please try again later.');
      }
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await GetLeaves();
      const userId = localStorage.getItem("id"); // ดึง user ID จาก localStorage
      const filteredLeaves = res.filter(leave => leave.user_id === parseInt(userId!)); // กรองเฉพาะการลาโดยใช้ user ID
      setLeaves(filteredLeaves.length > 0 ? filteredLeaves : []);
    } catch (error) {
      message.error('Failed to fetch leave request data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leave: LeaveInterface) => {
    setCurrentLeaveRequest(leave);
    form.setFieldsValue({
      status: leave.status || 'pending',
      day: dayjs(leave.day),
      description: leave.description,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to Delete this Leave request?',
      content: 'Once Deleted, this action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await DeleteLeaveById(id);
          message.success('Leave request Deleted successfully');
          fetchLeaves();
        } catch (error) {
          message.error('Failed to Delete Leave request');
        }
      },
    });
  };

  const handleEditSubmit = async (values: any) => {
    if (currentLeaveRequest) {
      const updatedLeaveRequest = {
        status: values.status,
        day: values.day.format('YYYY-MM-DD'),
        description: values.description,
      };

      try {
        await UpdateLeaveById(currentLeaveRequest.ID, updatedLeaveRequest);
        message.success('Leave request updated successfully');
        fetchLeaves();
        setIsEditModalVisible(false);
      } catch (error) {
        message.error('Failed to update leave request');
      }
    }
  };

  const getUserName = (userID: number) => {
    const user = users.find(u => u.ID === userID);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userID: number) => getUserName(userID),
    },
    {
      title: 'Date',
      dataIndex: 'day',
      key: 'day',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: LeaveInterface) => (
        <div style={{ textAlign: 'right' }}>
          <Space size="middle">
            <Button
              onClick={() => handleEdit(record)}
              style={styles.editButton}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => handleDelete(record.ID)}
              style={styles.deleteButton}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Title level={1} style={styles.headerTitle}>Manage Leave Requests</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={styles.addButton}
        onClick={() => navigate('/profile/leave/create')} // Navigate to CreateLeavePage
      >
        Create Leave Request
      </Button>

      <Table
        dataSource={leaves}
        columns={columns}
        rowKey="ID"
        loading={loading}
        style={styles.table}
      />

      {/* Edit Leave Request Modal */}
      <Modal
        title="Edit Leave Request"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            label="Date"
            name="day"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description' }]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeavePageId;
