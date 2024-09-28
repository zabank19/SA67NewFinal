import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  HistoryOutlined,
  DownOutlined,
  CommentOutlined,
  WarningOutlined,
  CarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, message, Dropdown } from "antd";
import logo from "../../assets/logo.png";
import Home from "../../pages/home";
import Rent from "../../pages/carsearch";
import Type from "../../pages/carsearch/cartype";
import Booking from "../../pages/carsearch/booking";
import Payment from "../../pages/carsearch/payment";
import VehicleManage from "../../pages/vehiclemanage";
import CarCreate from "../../pages/vehiclemanage/create";
import CarEdit from "../../pages/vehiclemanage/edit";
import ProfilePage from "../../pages/profile";
import RentManager from "../../pages/rentmanage";
import EmployeePage from "../../pages/employee";
import CreateEmployee from "../../pages/employee/create";
import EditEmployee from "../../pages/employee/edit";
import LeavePage from "../../pages/Leave";
import CreateLeavePage from "../../pages/Leave/create";
import CreateLeaves from "../../pages/profile/leave/create";
import EditProfile from "../../pages/profile/edit";
import { GetUsers } from "../../services/https";
import LeavePageId from "../../pages/profile/leave";
import History from "../../pages/history";
import Review from "../../pages/review";
import ReviewAll from "../../pages/reviewall";
import Adminreport from "../../pages/adminreport";
import Report from "../../pages/report";

const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const myId = localStorage.getItem("id");
  const [roles, setRoles] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await GetUsers();
        const userData = res.find((user) => user.ID === Number(myId));
        if (userData) {
          setRoles(userData.roles);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [myId]);

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "logout") {
      Logout();
    } else if (e.key === "profile") {
      setCurrentPage("profile");
      navigate("/profile");
    } else if (e.key === "history") {
      setCurrentPage("history");
      navigate(`/history/${myId}`);
    } else if (e.key === "employee") {
      setCurrentPage("employee");
      navigate("/employee");
    }
  };

  const userMenu = (
    <Menu
      onClick={handleMenuClick}
      style={{
        fontFamily: "Kanit, sans-serif",
        backgroundColor: "#003366",
        color: "#FFD700",
        border: "none",
      }}
    >
      <Menu.Item
        key="profile"
        style={{
          fontFamily: "Kanit, sans-serif",
          color: "#FFD700",
          transition: "background 0.3s",
          backgroundColor: "transparent",
          borderRadius: "4px",
        }}
      >
        <UserOutlined style={{ marginRight: "8px", color: "#FFD700" }} />
        Profile
      </Menu.Item>
      {roles === 1 && (
        <Menu.Item
          key="history"
          style={{
            fontFamily: "Kanit, sans-serif",
            color: "#FFD700",
            transition: "background 0.3s",
            backgroundColor: "transparent",
            borderRadius: "4px",
          }}
        >
          <HistoryOutlined style={{ marginRight: "8px", color: "#FFD700" }} />
          History
        </Menu.Item>
      )}
      {roles === 0 && (
        <Menu.Item
          key="employee"
          style={{
            fontFamily: "Kanit, sans-serif",
            color: "#FFD700",
            transition: "background 0.3s",
            backgroundColor: "transparent",
            borderRadius: "4px",
          }}
        >
          <UserOutlined style={{ marginRight: "8px", color: "#FFD700" }} />
          Employee
        </Menu.Item>
      )}
      <Menu.Item
        key="/reviewall"
        onClick={() => setCurrentPage("reviewall")}
        style={{
          borderRadius: "4px",
          transition: "background 0.3s",
          background: location.pathname === "/reviewall" ? "#1a2a40" : "transparent",
          color: "#FFD700",
        }}
      >
        <Link to="/reviewall" style={{ display: "flex", alignItems: "center", color: "#FFD700", fontFamily: "Kanit, sans-serif" }}>
          <CommentOutlined style={{ marginRight: "8px" }} />
          <span>Review</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        style={{
          fontFamily: "Kanit, sans-serif",
          color: "#FFD700",
          transition: "background 0.3s",
          backgroundColor: "transparent",
          borderRadius: "4px",
        }}
      >
        <LogoutOutlined style={{ marginRight: "8px", color: "#FFD700" }} />
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "Kanit, sans-serif", backgroundColor: "#003366" }}>
      {contextHolder}
      <Layout style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Header
          style={{
            background: "#003366",
            height: "80px",
            padding: "0 16px",
            position: "fixed",
            width: "100%",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={logo} alt="Logo" style={{ width: "60px", height: "auto", marginRight: "16px" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[page ? page : "home"]}
                selectedKeys={[location.pathname]}
                style={{
                  background: "transparent",
                  border: "none",
                  marginRight: "16px",
                  lineHeight: "64px",
                  fontFamily: "Kanit, sans-serif",
                }}
              >
                <Menu.Item
                  key="/"
                  onClick={() => setCurrentPage("home")}
                  style={{
                    borderRadius: "4px",
                    transition: "background 0.3s",
                    background: location.pathname === "/" ? "#1a2a40" : "transparent",
                    marginRight: "16px",
                    color: "#FFD700",
                  }}
                >
                  <Link to="/" style={{ display: "flex", alignItems: "center", color: "#FFD700", fontFamily: "Kanit, sans-serif" }}>
                    <DashboardOutlined style={{ marginRight: "8px" }} />
                    <span>Home</span>
                  </Link>
                </Menu.Item>

                <Menu.Item
                  key="/rent"
                  onClick={() => setCurrentPage("rent")}
                  style={{
                    borderRadius: "4px",
                    transition: "background 0.3s",
                    background: location.pathname === "/rent" ? "#1a2a40" : "transparent",
                    color: "#FFD700",
                  }}
                >
                  <Link to="/rent" style={{ display: "flex", alignItems: "center", color: "#FFD700", fontFamily: "Kanit, sans-serif" }}>
                    <CarOutlined style={{ marginRight: "8px" }} />
                    <span>Rent</span>
                  </Link>
                </Menu.Item>

                {roles !== 1 && (
                  <Menu.Item
                    key="/vehiclemanage"
                    onClick={() => setCurrentPage("vehiclemanage")}
                    style={{
                      borderRadius: "4px",
                      transition: "background 0.3s",
                      background: location.pathname === "/vehiclemanage" ? "#1a2a40" : "transparent",
                      color: "#FFD700",
                    }}
                  >
                    <Link to="/vehiclemanage" style={{ display: "flex", alignItems: "center", color: "#FFD700", fontFamily: "Kanit, sans-serif" }}>
                      <CarOutlined style={{ marginRight: "8px" }} />
                      <span>Vehicle Management</span>
                    </Link>
                  </Menu.Item>
                )}

                {roles !== 1 && (
                  <Menu.Item
                    key="/rentmanager"
                    onClick={() => setCurrentPage("rentmanager")}
                    style={{
                      borderRadius: "4px",
                      transition: "background 0.3s",
                      background: location.pathname === "/rentmanager" ? "#1a2a40" : "transparent",
                      color: "#FFD700",
                    }}
                  >
                    <Link to="/rentmanager" style={{ display: "flex", alignItems: "center", color: "#FFD700", fontFamily: "Kanit, sans-serif" }}>
                      <UserOutlined style={{ marginRight: "8px" }} />
                      <span>Rent Manager</span>
                    </Link>
                  </Menu.Item>
                )}

                {roles !== 1 && (
                  <Menu.Item
                    key="/adminreport"
                    onClick={() => setCurrentPage("adminreport")}
                    style={{
                      borderRadius: "4px",
                      transition: "background 0.3s",
                      background: location.pathname === "/adminreport" ? "#1a2a40" : "transparent",
                      color: "#FFD700",
                    }}
                  >
                    <Link to="/adminreport">
                      <WarningOutlined />
                      <span>Report</span>
                    </Link>
                  </Menu.Item>
                )}

                {roles === 1 && (
                  <Menu.Item
                    key="/report"
                    onClick={() => setCurrentPage("report")}
                    style={{
                      borderRadius: "4px",
                      transition: "background 0.3s",
                      background: location.pathname === "/report" ? "#1a2a40" : "transparent",
                      color: "#FFD700",
                    }}
                  >
                    <Link to="/report">
                      <WarningOutlined />
                      <span>Report</span>
                    </Link>
                  </Menu.Item>
                )}
              </Menu>
              <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
                <Button
                  style={{
                    backgroundColor: "#003366",
                    color: "#FFD700",
                    border: "none",
                    fontFamily: "Kanit, sans-serif",
                    borderRadius: "4px",
                    marginLeft: "16px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    padding: "0 16px",
                    height: "40px",
                  }}
                >
                  <UserOutlined style={{ marginRight: "8px", fontSize: "18px" }} />
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Layout style={{ marginTop: "48px", display: "flex", flexDirection: "column", flex: 1 }}>
          <Content
            style={{
              flex: 1,
              padding: 0,
              margin: 0,
              background: "#FFFFFF",
              minHeight: "calc(100vh - 80px - 64px)",
              overflow: "hidden",
            }}
          >
            <Breadcrumb style={{ margin: "16px 0" }} />
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/rent/type/:type" element={<Type />} />
                <Route path="/rent/booking/:carId" element={<Booking />} />
                <Route path="/rent/payment/:bookingId" element={<Payment />} />
                <Route path="/vehiclemanage" element={<VehicleManage />} />
                <Route path="/vehiclemanage/create" element={<CarCreate />} />
                <Route path="/vehiclemanage/edit/:id" element={<CarEdit />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/history/:id" element={<History />} />
                <Route path="/review/:id" element={<Review />} />
                <Route path="/reviewall" element={<ReviewAll roles={roles} />} />
                <Route path="/employee" element={<EmployeePage />} />
                <Route path="/employee/edit/:id" element={<EditEmployee />} />
                <Route path="/employee/create" element={<CreateEmployee />} />
                <Route path="/rentmanager" element={<RentManager />} />
                <Route path="/Leave" element={<LeavePage />} />
                <Route path="/Leave/create" element={<CreateLeavePage />} />
                <Route path="/profile/edit/:id" element={<EditProfile />} />
                <Route path="/profile/Leave" element={<LeavePageId />} />
                <Route path="/profile/Leave/create" element={<CreateLeaves />} />
                <Route path="/adminreport" element={<Adminreport />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </div>
          </Content>

          <Footer style={{ textAlign: "center", background: "#003366", color: "#FFD700", height: "64px", fontFamily: "Kanit, sans-serif" }}>
            TWN RENT CAR
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default FullLayout;
