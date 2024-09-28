import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Typography,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Select,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  GetRents,
  UpdateRentById,
  DeleteRentById,
  GetUsers,
  GetCars,
  GetRentById,
  CreateRent,
} from '../../services/https';
import { RentInterface } from '../../interfaces/IRent';
import { UsersInterface } from '../../interfaces/IUser';
import { CarInterface } from '../../interfaces/ICar';
import dayjs from 'dayjs';

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
  searchInput: {
    fontSize: '16px',
    width: '100%',
    marginBottom: '16px',
    fontFamily: 'Kanit, sans-serif',
  },
  filterSelect: {
    width: '100%',
    marginBottom: '16px',
    fontFamily: 'Kanit, sans-serif',
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

const ManageRentPage = () => {
  const [rents, setRents] = useState<RentInterface[]>([]);
  const [filteredRents, setFilteredRents] = useState<RentInterface[]>([]);
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentRent, setCurrentRent] = useState<RentInterface | null>(null);
  const [form] = Form.useForm();
  const [searchName, setSearchName] = useState<string>('');
  const [searchLicensePlateProvince, setSearchLicensePlateProvince] =
    useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [startRentDate, setStartRentDate] = useState<any>(null);
  const [endRentDate, setEndRentDate] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [usersData, carsData, rentsData] = await Promise.all([
        GetUsers(),
        GetCars(),
        GetRents(),
      ]);
      setUsers(usersData);
      setCars(carsData);
      setRents(rentsData); // Store all rents initially
      setFilteredRents(rentsData); // Set filtered rents initially
    } catch (error) {
      message.error('Failed to fetch data');
    }
  };

  const filterRents = (
    rents: RentInterface[],
    users: UsersInterface[],
    cars: CarInterface[]
  ) => {
    const [searchFirstName, searchLastName] = searchName.split(' ');

    return rents.filter((rent) => {
      const user = users.find((u) => u.ID === rent.user_id);
      const car = cars.find((c) => c.ID === rent.car_id);
      const userFirstName = user ? user.first_name : '';
      const userLastName = user ? user.last_name : '';
      const carLicensePlate = car ? car.license_plate : '';
      const carProvince = car ? car.province : '';
      const [searchLicensePlate, searchProvince] =
        searchLicensePlateProvince.split(',');

      return (
        (searchFirstName
          ? userFirstName.toLowerCase().includes(searchFirstName.toLowerCase())
          : true) &&
        (searchLastName
          ? userLastName.toLowerCase().includes(searchLastName.toLowerCase())
          : true) &&
        (searchLicensePlate
          ? carLicensePlate
              .toLowerCase()
              .includes(searchLicensePlate.trim().toLowerCase())
          : true) &&
        (searchProvince
          ? carProvince
              .toLowerCase()
              .includes(searchProvince.trim().toLowerCase())
          : true) &&
        (searchStatus ? rent.Status === searchStatus : true)
      );
    });
  };

  const handleAddSubmit = async (values: any) => {
    const price = calculatePrice(values.start_rent, values.end_rent, values.car_id);
    
    const newRent = {
      car_id: values.car_id,
      user_id: values.user_id,
      start_rent: values.start_rent.toISOString(),
      end_rent: values.end_rent.toISOString(),
      price: price,
      status: values.status,
    };
  
    try {
      const response = await CreateRent(newRent);
      console.log('API Response:', response);
      message.success('New rent record added successfully');
      await fetchData();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Error adding rent:', error);
      message.error('Failed to add new rent record');
    }
  };

  const handleEdit = async (rent: RentInterface) => {
    try {
      const rentData = await GetRentById(rent.ID);
      form.setFieldsValue({
        rentID: rentData.ID,
        car_id: rentData.car_id,
        user_id: rentData.user_id,
        start_rent: dayjs(rentData.start_rent),
        end_rent: dayjs(rentData.end_rent),
        price: rentData.price,
        status: rentData.Status,
      });

      setSelectedCar(rentData.car_id);
      setStartRentDate(dayjs(rentData.start_rent));
      setEndRentDate(dayjs(rentData.end_rent));
      setCurrentRent(rentData);
      setIsEditModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch rent details');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this rent record?',
      content: 'Once deleted, this action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await DeleteRentById(id);
          message.success('Rent record deleted successfully');
          await fetchData();
        } catch (error) {
          message.error('Failed to delete rent record');
        }
      },
    });
  };

  const handleEditSubmit = async (values: any) => {
    if (currentRent) {
      const price = calculatePrice(values.start_rent, values.end_rent, values.car_id);
      
      const updatedRent = {
        car_id: values.car_id,
        user_id: values.user_id,
        start_rent: values.start_rent.toISOString(),
        end_rent: values.end_rent.toISOString(),
        price: price,
        status: values.Status,
      };

      try {
        await UpdateRentById(currentRent.ID, updatedRent);
        message.success('Rent record updated successfully');
        await fetchData();
        setIsEditModalVisible(false);
      } catch (error) {
        message.error('Failed to update rent record');
      }
    }
  };

  const getUserName = (userID: number) => {
    const user = users.find((u) => u.ID === userID);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const getCarDetails = (carID: number) => {
    const car = cars.find((c) => c.ID === carID);
    return car ? `${car.license_plate}, ${car.province}` : 'Unknown';
  };

  const calculatePrice = (startDate: any, endDate: any, carID: number | null) => {
    if (!startDate || !endDate || !carID) return 0;

    const car = cars.find((c) => c.ID === carID);
    if (!car) return 0;

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = end.diff(start, 'day') + 1;

    return duration * car.price; // Assuming car.price is available
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredRents = filterRents(rents, users, cars);
    setFilteredRents(filteredRents);
  }, [searchName, searchLicensePlateProvince, searchStatus, users, cars]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_id',
      render: (text: number) => getUserName(text),
    },
    {
      title: 'Car',
      dataIndex: 'car_id',
      render: (text: number) => getCarDetails(text),
    },
    {
      title: 'Start Rent',
      dataIndex: 'start_rent',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'End Rent',
      dataIndex: 'end_rent',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text: number) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      render: (text: string) => text,
    },
    {
      title: 'Actions',
      render: (_: any, rent: RentInterface) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(rent)}
            style={styles.editButton}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(rent.ID)}
            style={styles.deleteButton}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Title style={styles.headerTitle}>Manage Rent</Title>
      <Input
        style={styles.searchInput}
        placeholder="Search by User Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <Input
        style={styles.searchInput}
        placeholder="Search by License Plate, Province"
        value={searchLicensePlateProvince}
        onChange={(e) => setSearchLicensePlateProvince(e.target.value)}
      />
      <Select
        style={styles.filterSelect}
        placeholder="Filter by Status"
        value={searchStatus}
        onChange={(value) => setSearchStatus(value)}
      >
        <Option value="">All</Option>
        <Option value="paymented">paymented</Option>
              <Option value="Pending Payment">Pending Payment</Option>
      </Select>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
        Add Rent
      </Button>
      <Table
        style={styles.table}
        columns={columns}
        dataSource={filteredRents} // Use filtered rents here
        rowKey="ID"
      />

      <Modal
        title="Add Rent"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item
            label="Car"
            name="car_id"
            rules={[{ required: true, message: 'Please select a car' }]}
          >
            <Select
              placeholder="Select a car"
              onChange={setSelectedCar}
            >
              {cars.map((car) => (
                <Option key={car.ID} value={car.ID}>
                  {car.license_plate}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="User"
            name="user_id"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select placeholder="Select a user">
              {users.map((user) => (
                <Option key={user.ID} value={user.ID}>
                  {`${user.first_name} ${user.last_name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Rent"
            name="start_rent"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker
              
              onChange={(date) => setStartRentDate(date)}
            />
          </Form.Item>
          <Form.Item
            label="End Rent"
            name="end_rent"
            rules={[{ required: true, message: 'Please select an end date' }]}
          >
            <DatePicker
              
              onChange={(date) => setEndRentDate(date)}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
            <Option value="paymented">paymented</Option>
            <Option value="Pending Payment">Pending Payment</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Rent
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Rent"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Car"
            name="car_id"
            rules={[{ required: true, message: 'Please select a car' }]}
          >
            <Select
              placeholder="Select a car"
              onChange={setSelectedCar}
            >
              {cars.map((car) => (
                <Option key={car.ID} value={car.ID}>
                  {car.license_plate}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="User"
            name="user_id"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select placeholder="Select a user">
              {users.map((user) => (
                <Option key={user.ID} value={user.ID}>
                  {`${user.first_name} ${user.last_name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Rent"
            name="start_rent"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker
              
              onChange={(date) => setStartRentDate(date)}
            />
          </Form.Item>
          <Form.Item
            label="End Rent"
            name="end_rent"
            rules={[{ required: true, message: 'Please select an end date' }]}
          >
            <DatePicker
            
              onChange={(date) => setEndRentDate(date)}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
            <Option value="paymented">paymented</Option>
            <Option value="Pending Payment">Pending Payment</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRentPage;