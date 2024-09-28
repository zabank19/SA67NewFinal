import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Divider,
  message,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '../../../services/https';
import { SignInInterface } from '../../../interfaces/SignIn';
import { useState } from 'react';
import logo from "../../../assets/logo.png";

const { Text } = Typography;

const SignInPages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignInInterface) => {
    try {
      setLoading(true);
      let res = await SignIn(values);
      if (res.id) {
        message.success("Login successful");
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("page", "dashboard");
        localStorage.setItem("token_type", res.token_type);
        localStorage.setItem("token", res.token);
        localStorage.setItem("id", res.id); // Store user ID
        navigate("/"); // Redirect to the home page
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Kanit, sans-serif', // Apply Kanit font to the entire page
      }}
    >
      {/* Background video */}
      <video
        src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="TWN Rent Car" style={{ height: '40px', marginBottom: '16px' }} />
          <Typography.Title level={3} style={{ color: 'white', marginBottom: '8px', fontFamily: 'Kanit, sans-serif' }}>
            TWN Rent Car
          </Typography.Title>
          <Typography.Text style={{ color: 'white', fontFamily: 'Kanit, sans-serif' }}>
            Welcome to TWN Rent Car
          </Typography.Text>
        </div>

        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not a valid email!' },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="Email"
              style={{ borderRadius: '4px', backgroundColor: 'white', color: 'black', fontFamily: 'Kanit, sans-serif' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Password"
              style={{ borderRadius: '4px', backgroundColor: 'white', color: 'black', fontFamily: 'Kanit, sans-serif' }}
            />
          </Form.Item>

          <Form.Item>
          <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
                borderRadius: '8px',
                marginTop: '16px',
                fontFamily: 'Kanit, sans-serif',
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <center>
          <Text style={{ fontSize: 12, color: '#FFD700', fontFamily: 'Kanit, sans-serif' }}>
            <a onClick={() => navigate("/signup")} style={{ color: '#FFD700', fontFamily: 'Kanit, sans-serif' }}>
              Sign up now!
            </a>
          </Text>
        </center>
      </div>
    </div>
  );
};

export default SignInPages;
