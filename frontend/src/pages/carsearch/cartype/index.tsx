import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetCars } from "../../../services/https";
import { CarInterface } from "../../../interfaces/ICar";
import { Card, Row, Col, Typography, Select, Alert } from "antd";
import Loader from "../../../components/third-patry/Loader"; // Import Loader component

const { Title, Text } = Typography;
const { Option } = Select;

const provinces = [
  "ภูเก็ต", "นครสวรรค์", "นครราชสีมา",
  // เพิ่มชื่อจังหวัดอื่น ๆ ตามต้องการ
];

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #003366',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Kanit, sans-serif',
  },
  title: {
    fontSize: '36px',
    fontFamily: 'Kanit, sans-serif',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    marginBottom: '20px',
    fontFamily: 'Kanit, sans-serif',
  },
  card: {
    cursor: 'pointer',
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Kanit, sans-serif',
  },
  cardImage: {
    height: '180px',
    objectFit: 'cover',
  },
  cardDescription: {
    fontSize: '14px',
    fontFamily: 'Kanit, sans-serif',
  },
  cardMeta: {
    fontFamily: 'Kanit, sans-serif',
  },
};

// Utility function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CarType = () => {
  const { type } = useParams<{ type: string }>();
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarInterface[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const getCarsByType = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const [res] = await Promise.all([GetCars(), delay(1250)]); // Add delay of 1.25 seconds
      if (res.length > 0) {
        const allCars = res.filter(car => 
          car.type === type &&
          car.status === 'พร้อมใช้งาน'
        );
        setCars(allCars);
        setFilteredCars(allCars);
      } else {
        setCars([]);
        setFilteredCars([]);
      }
    } catch (error) {
      console.log("Error fetching cars");
    } finally {
      setLoading(false); // Stop loading after fetching data and delay
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (type) {
      getCarsByType();
    }
  }, [type]);

  useEffect(() => {
    if (selectedProvince) {
      setFilteredCars(cars.filter(car => car.province === selectedProvince));
    } else {
      setFilteredCars(cars);
    }
  }, [selectedProvince, cars]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
  };

  const handleCardClick = (car: CarInterface) => {
    navigate(`/rent/booking/${car.ID}`);
  };

  if (loading) {
    return <Loader />; // Display loader when loading is true
  }

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>{type}</Title>

      <Select
        placeholder="เลือกจังหวัด"
        style={styles.select}
        onChange={handleProvinceChange}
        allowClear
      >
        {provinces.map(province => (
          <Option key={province} value={province}>
            {province}
          </Option>
        ))}
      </Select>

      {filteredCars.length === 0 && (
        <Alert
          message="ไม่มีรถว่างในตอนนี้"
          type="info"
          showIcon
        />
      )}

      <Row gutter={16}>
        {filteredCars.map(car => (
          <Col xs={24} sm={12} md={8} lg={6} key={car.ID}>
            <Card
              cover={<img src={car.picture} alt={car.license_plate} style={styles.cardImage} />}
              onClick={() => handleCardClick(car)}
              style={styles.card}
            >
              <Card.Meta
                title={<Text style={styles.cardMeta}>{car.license_plate}</Text>}
                description={
                  <div style={styles.cardDescription}>
                    <Text style={styles.cardMeta}>Brand: {car.brands}</Text><br />
                    <Text style={styles.cardMeta}>Model Year: {car.model_year}</Text><br />
                    <Text style={styles.cardMeta}>Province: {car.province}</Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CarType;