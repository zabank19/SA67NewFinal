import React, { useState, useEffect } from "react";
import { Button, Row, Col, Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { GetCars } from "../../services/https";
import { CarInterface } from "../../interfaces/ICar";
import Loader from "../../components/third-patry/Loader"; // Import the Loader component

const { Title, Text } = Typography;

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
    marginBottom: '20px',
    fontFamily: 'Kanit, sans-serif',
  },
  button: {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#003366',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'Kanit, sans-serif',
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    transition: 'transform 1s ease-in-out',
    willChange: 'transform',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  text: {
    marginTop: '10px',
    fontSize: '18px',
    fontFamily: 'Kanit, sans-serif',
  },
};

// Utility function to delay for a specific time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function CarSearch() {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [imagesByType, setImagesByType] = useState<Record<string, string[]>>({
    'Eco car': [],
    'Van': [],
    'Motorcycle': []
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({
    'Eco car': 0,
    'Van': 0,
    'Motorcycle': 0
  });
  const [intervals, setIntervals] = useState<Record<string, NodeJS.Timeout | null>>({
    'Eco car': null,
    'Van': null,
    'Motorcycle': null
  });
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  const getCars = async () => {
    try {
      const [res] = await Promise.all([GetCars(), delay(1250)]); // Ensure at least 1.25 sec delay

      if (res.length > 0) {
        setCars(res);
        const groupedImages: Record<string, string[]> = {
          'Eco car': [],
          'Van': [],
          'Motorcycle': []
        };
        res.forEach((car: { type: string | number; picture: string; }) => {
          if (groupedImages[car.type]) {
            groupedImages[car.type].push(car.picture);
          }
        });
        setImagesByType(groupedImages);
      } else {
        setCars([]);
        setImagesByType({
          'Eco car': [],
          'Van': [],
          'Motorcycle': []
        });
      }
    } catch (error) {
      console.error("Failed to fetch car data", error);
    } finally {
      setLoading(false); // Stop loading after fetching data and delay
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    Object.keys(imagesByType).forEach(type => {
      if (imagesByType[type].length > 0) {
        const interval = setInterval(() => {
          setCurrentImageIndex(prevState => ({
            ...prevState,
            [type]: (prevState[type] + 1) % imagesByType[type].length
          }));
        }, 3000);

        if (intervals[type]) {
          clearInterval(intervals[type] as NodeJS.Timeout);
        }

        setIntervals(prevState => ({
          ...prevState,
          [type]: interval
        }));
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        if (interval) {
          clearInterval(interval);
        }
      });
    };
  }, [imagesByType]);

  const handleTypeClick = (type: string) => {
    navigate(`/rent/type/${type}`);
  };

  if (loading) {
    return <Loader />; // Display loader while data is loading
  }

  return (
    <div style={styles.container}>
      <Title level={1} style={styles.title}>กรุณาเลือกประเภทรถ</Title>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        {['Eco car', 'Van', 'Motorcycle'].map(type => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{ textAlign: 'center' }} key={type}>
            <Button
              style={styles.button}
              onClick={() => handleTypeClick(type)}
            >
              <div
                style={{
                  ...styles.imageWrapper,
                  transform: `translateX(-${currentImageIndex[type] * 100}%)`,
                }}
              >
                {imagesByType[type].map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`car-${index}`}
                    style={{
                      ...styles.image,
                      transform: `translateX(${currentImageIndex[type] * 100}%)`,
                      position: index === currentImageIndex[type] ? 'relative' : 'absolute',
                      opacity: index === currentImageIndex[type] ? 1 : 0,
                      transition: 'opacity 1s ease-in-out',
                    }}
                  />
                ))}
              </div>
            </Button>
            <Text style={styles.text}>{type}</Text>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CarSearch;