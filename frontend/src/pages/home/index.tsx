import React, { useState, useEffect } from 'react';
import { Carousel, Button } from 'antd';
import { Link } from 'react-router-dom';
import w1 from "../../assets/w1.jpg";
import w2 from "../../assets/w2.jpg";
import w3 from "../../assets/w3.jpg";
import w4 from "../../assets/w4.jpg";

const carouselStyle: React.CSSProperties = {
  position: 'relative',
  fontFamily: "'Kanit', sans-serif",
};

const contentStyle: React.CSSProperties = {
  height: '778px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  fontFamily: "'Kanit', sans-serif",
};

const logoStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
  fontSize: '48px',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  zIndex: 1,
  textAlign: 'center',
  width: '100%',
  whiteSpace: 'nowrap',
  fontFamily: "'Kanit', sans-serif",
};

// Keyframes animation สำหรับไฟวิ่ง
const keyframes = `
@keyframes glowing-border {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 255, 255, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
`;

// เพิ่ม keyframes ลงใน document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

const buttonStyle: React.CSSProperties = {
  fontFamily: "'Kanit', sans-serif",
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // สีดำโปร่งแสงเพื่อให้ปุ่มเด่น
  borderColor: '#fff', // ขอบปุ่มสีขาว
  color: '#fff', // ข้อความสีขาว
  fontSize: '30px',
  padding: '20px 50px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)', // เงาปุ่มเพื่อให้ดูมีมิติ
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  animation: 'glowing-border 1.5s infinite', // Animation สำหรับขอบปุ่ม
};

const buttonHoverStyle: React.CSSProperties = {
  transform: 'scale(1.1)',
  boxShadow: '0 6px 14px rgba(0, 0, 0, 0.6)', // เพิ่มความเด่นในขณะ hover
};

const textArray = ['TWN Rent Car', 'ปล่อยให้รถของเราเป็นคู่หูในการเดินทางของคุณ', 'พร้อมให้บริการรถเช่าที่ทำให้การเดินทางของคุณง่ายและสะดวกขึ้น', 'สัมผัสประสบการณ์การขับขี่ที่แตกต่าง ด้วยบริการเช่ารถคุณภาพ'];

const App: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (event.deltaY > 0 && currentTextIndex < textArray.length - 1) {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      } else if (event.deltaY < 0 && currentTextIndex > 0) {
        setCurrentTextIndex((prevIndex) => prevIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentTextIndex]);

  return (
    <div style={{ position: 'relative', height: '778px', fontFamily: "'Kanit', sans-serif" }}>
      <Carousel autoplay autoplaySpeed={2000} style={carouselStyle}>
        <div>
          <div style={contentStyle}>
            <img src={w1} alt="Wallpaper Slide 1" style={logoStyle} />
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <img src={w2} alt="Wallpaper Slide 2" style={logoStyle} />
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <img src={w3} alt="Wallpaper Slide 3" style={logoStyle} />
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <img src={w4} alt="Wallpaper Slide 4" style={logoStyle} />
          </div>
        </div>
      </Carousel>
      <div style={overlayStyle}>
        <div>{textArray[currentTextIndex]}</div>
        {currentTextIndex === textArray.length - 1 && (
          <Link to="/rent">
            <Button
              type="primary"
              size="large"
              style={hovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              เช่าเลย
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default App;
