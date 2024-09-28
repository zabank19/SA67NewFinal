import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Card,
  message,
  Input,
  Popconfirm,
  Typography,
  List,
  Select
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import { GetCars, DeleteCarById } from "../../services/https";
import { CarInterface } from "../../interfaces/ICar";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from 'antd';
import Loader from "../../components/third-patry/Loader"; // Import the Loader component

const { Title, Text } = Typography;
const { Option } = Select;

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #003366',  // เพิ่มกรอบสีน้ำเงิน
    borderRadius: '8px',          // เพิ่มขอบมน
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // เพิ่มเงาเพื่อให้ดูยกระดับขึ้น
  },

  headerActions: {
    textAlign: 'end',
  },
  searchRow: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fontFamily: 'Kanit, sans-serif',
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
  carLicense: {
    fontSize: '18px',
    fontFamily: 'Kanit, sans-serif',
  },
  listTitle: {
    fontSize: '16px',
    fontFamily: 'Kanit, sans-serif',
  },
  listDescription: {
    fontSize: '14px',
    fontFamily: 'Kanit, sans-serif',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    fontFamily: 'Kanit, sans-serif',
    border: '3px solid #d9d9d9',
  },
  listItemContent: {
    flex: 1,
  },
  listItemActions: {
    display: 'flex',
    gap: '8px',
  },
  buttonMargin: {
    marginRight: '8px',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    position: 'relative',
    width: '100%',
    height: 'auto',
    fontFamily: 'Kanit, sans-serif',
    border: '3px solid #d9d9d9', // Add border to Card
  },
  cardCover: {
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '3px solid #d9d9d9',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardActions: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    margin: '0 4px',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '8px 16px',
    fontFamily: 'Kanit, sans-serif',
  },
  popconfirm: {
    top: '50% !important',
    left: '50% !important',
    transform: 'translate(-50%, -50%) !important',
  },
  statusBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
  statusBadgeReady: {
    backgroundColor: '#4caf50',
  },
  statusBadgeNotAvailable: {
    backgroundColor: '#f44336',
  },
  statusBadgeInRepair: {
    backgroundColor: '#9e9e9e',
  },
  listItemImage: {
    height: '100px',
    width: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '3px solid #d9d9d9',
    marginRight: '16px',
  },
};

function VehicleManage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [viewType, setViewType] = useState('list');
  const [loading, setLoading] = useState(true); // State for loading
  const [messageApi, contextHolder] = message.useMessage();

  const getCars = async () => {
    setLoading(true); // Show loader
  
    // Create a promise that resolves after 3 seconds
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
    try {
      // Start fetching cars and wait for both fetching and delay to complete
      const [res] = await Promise.all([
        GetCars(),
        delay(1250) // 3-second delay
      ]);
  
      if (res.length > 0) {
        setCars(res);
        setFilteredCars(res);
      } else {
        setCars([]);
        setFilteredCars([]);
      }
    } catch (error) {
      messageApi.error("Failed to fetch cars");
    } finally {
      setLoading(false); // Hide loader
    }
  };
  

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car => {
      return (
        (searchTerm ? car.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (selectedStatus ? car.status === selectedStatus : true) &&
        (selectedType ? car.type === selectedType : true)
      );
    });
    setFilteredCars(filtered);
  }, [searchTerm, selectedStatus, selectedType, cars]);

  const handleDelete = async (id: string) => {
    try {
      const res = await DeleteCarById(id);
      if (res) {
        messageApi.success("Car deleted successfully");
        getCars();
      } else {
        messageApi.error("Failed to delete the car");
      }
    } catch (error) {
      messageApi.error("An error occurred while deleting the car");
    }
  };

  return (
    <>
      {contextHolder}
      {loading && <Loader />} {/* Show loader when loading */}
      <div style={{ fontFamily: styles.fontFamily, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.container}>
          <Row>
            <Col span={12}>
              <Title level={1} style={styles.headerTitle}>Car Management</Title>
            </Col>
            <Col span={12} style={styles.headerActions}>
              <Space>
                <Link to="/vehiclemanage/create">
                  <Button type="primary" icon={<PlusOutlined />} style={styles.addButton}>
                    Add
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
          <Divider />
          <Row style={styles.searchRow}>
          <Col span={10}>
          <Button
                  type="default"
                  icon={viewType === 'list' ? <AppstoreAddOutlined /> : <UnorderedListOutlined />}
                  onClick={() => setViewType(viewType === 'list' ? 'card' : 'list')}
                  style={styles.addButton}
                >
                  {viewType === 'list' ? 'Card View' : 'List View'}
                </Button>
                </Col>
            <Col span={8}>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                suffix={<SearchOutlined />}
              />
            </Col>
            <Col span={3}>
              <Select
                placeholder="Select Status"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                style={styles.filterSelect}
              >
                <Option value={undefined}>Status</Option>
                <Option value="พร้อมใช้งาน">Ready</Option>
                <Option value="งดใช้งานชั่วคราว">Not Available</Option>
                <Option value="อยู่ระหว่างซ่อม">In Repair</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select
                placeholder="Select Type"
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                style={styles.filterSelect}
              >
                <Option value={undefined}>Type</Option>
                <Option value="Eco car">Eco Car</Option>
                <Option value="Van">Van</Option>
                <Option value="Motorcycle">Motorcycle</Option>
              </Select>
            </Col>
          </Row>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {viewType === 'card' ? (
              <Row gutter={[16, 16]}>
                {filteredCars.map((car) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={car.ID}>
                    <Card style={styles.card} cover={
                      <img src={car.picture} alt="Car" style={styles.cardCover} />
                    } actions={[
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/vehiclemanage/edit/${car.ID}`)}
                        style={{ ...styles.actionButton, backgroundColor: '#003366', color: '#fff' }}
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Are you sure to delete this car?"
                        onConfirm={() => handleDelete(car.ID)}
                        okText="Yes"
                        cancelText="No"
                        overlayClassName="custom-popconfirm"
                      >
                        <Button
                          type="dashed"
                          danger
                          icon={<DeleteOutlined />}
                          style={{ ...styles.actionButton, backgroundColor: '#FF0000', border: 'none', color: '#ffffff' }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    ]}>
                      <div style={{
                        ...styles.statusBadge,
                        ...(car.status === 'พร้อมใช้งาน' ? styles.statusBadgeReady :
                          car.status === 'งดใช้งานชั่วคราว' ? styles.statusBadgeNotAvailable :
                          styles.statusBadgeInRepair),
                      }} />
                      <Card.Meta
                        avatar={<Avatar src={car.picture} />}
                        title={<Text style={styles.carLicense}>{car.license_plate}</Text>}
                        description={<Text style={{ fontFamily: styles.fontFamily }}>{`${car.brands} - ${car.model_year}`}</Text>}
                        style={styles.cardMeta}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <List
                dataSource={filteredCars}
                renderItem={car => (
                  <List.Item style={styles.listItem} actions={[
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/vehiclemanage/edit/${car.ID}`)}
                      style={{ ...styles.actionButton, backgroundColor: '#003366', color: '#fff' }}
                    >
                      Edit
                    </Button>,
                    <Popconfirm
                      title="Are you sure to delete this car?"
                      onConfirm={() => handleDelete(car.ID)}
                      okText="Yes"
                      cancelText="No"
                      overlayClassName="custom-popconfirm"
                    >
                      <Button
                        type="dashed"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ ...styles.actionButton, backgroundColor: '#FF0000', border: 'none', color: '#ffffff' }}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  ]}>
                    <List.Item.Meta
                      avatar={<img src={car.picture} alt="Car" style={styles.listItemImage} />}
                      title={<Text style={styles.listTitle}>{car.license_plate}</Text>}
                      description={
                        <Row gutter={16}>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>จังหวัด: {car.province}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>แบรนด์: {car.brands}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>รุ่น: {car.models}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>ปี: {car.model_year}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>สี: {car.color}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>เลขตัวถัง: {car.vehicle_identification_number}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>เลขที่รย. : {car.vehicle_registration_number}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>ราคา/วัน. : {car.price}</Text>
                          </Col>
                          <Col span={6}>
                            <Text style={{ fontFamily: styles.fontFamily }}>สถานะ : {car.status}</Text>
                          </Col>
                        </Row>
                      }
                    />
                    <div style={{
                      ...styles.statusBadge,
                      ...(car.status === 'พร้อมใช้งาน' ? styles.statusBadgeReady :
                        car.status === 'งดใช้งานชั่วคราว' ? styles.statusBadgeNotAvailable :
                        styles.statusBadgeInRepair),
                    }} />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VehicleManage;