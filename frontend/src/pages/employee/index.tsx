import { useState, useEffect } from "react";
import { Space, Table, Button, Modal, Col, Row, Divider, message, Typography, Avatar } from "antd"; // Import Avatar component
import { PlusOutlined, EditOutlined, DeleteOutlined, FieldTimeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetUsers, DeleteUsersById } from "../../services/https/index";
import { UsersInterface } from "../../interfaces/IUser";
import { Link, useNavigate } from "react-router-dom";
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
  }
};

function EmployeePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id") || ""; // Ensure myId is a string

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await GetUsers();
      // Filter to show only Admin and Employee roles
      const filteredUsers = response.filter(user => user.roles === 0 || user.roles === 2);
      setUsers(filteredUsers);
    } catch (error) {
      if (error.response) {
        message.error(`Error fetching users: ${error.response.data.message}`);
      } else {
        message.error('Network error. Please try again later.');
      }
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to Delete this Account?',
      content: 'Once Deleted, this action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await DeleteUsersById(id);
          message.success('Account deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Failed to Delete Account');
        }
      },
    });
  };

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "",
      dataIndex: "picture",
      key: "picture",
      render: (picture) => (
        <Avatar src={picture} style={styles.avatar} />
      ),
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => {
        switch (roles) {
          case 0:
            return "Admin";
          case 1:
            return "User";
          case 2:
            return "Employee";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "วัน/เดือน/ปี เกิด",
      key: "birthday",
      render: (record) => <>{dayjs(record.birthday).format("DD/MM/YYYY")}</>,
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => <>{record?.gender?.gender}</>,
    },
    {
      title: "",
      render: (record) => (
        <Space>
          <Button
            style={{ border: '2px solid #003366', backgroundColor: '#003366', fontFamily: 'Kanit, sans-serif' }}
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employee/edit/${record.ID}`)}
          >
            แก้ไข
          </Button>
          {myId !== record.ID && (
            <Button
              style={{ border: '2px solid #FF0000', backgroundColor: '#FF0000', color: '#ffffff', fontFamily: 'Kanit, sans-serif' }}
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.ID)}
            >
              ลบ
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      {contextHolder}

      <Row justify="space-between" align="middle">
        <Col>
          <Title level={1} style={styles.headerTitle}>จัดการข้อมูลพนักงาน</Title>
        </Col>

        <Col>
          <Space>
            <Link to="/Leave" style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
              <Button type="primary" icon={<FieldTimeOutlined />} style={styles.addButton}>
                <span>ลางาน</span>
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space>
            <Link to="/employee/create" style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
              <Button type="primary" icon={<PlusOutlined />} style={styles.addButton}>
                <span>Create account</span>
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Divider />

      <div style={styles.table}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={users}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}

export default EmployeePage;
