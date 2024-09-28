import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Loadable from '../components/third-patry/Loadable';
import FullLayout from '../layout/FullLayout';

// Lazy load the components
const MainPages = Loadable(lazy(() => import('../pages/authentication/Login')));
const Dashboard = Loadable(lazy(() => import('../pages/home')));
const Vehiclemanage = Loadable(lazy(() => import('../pages/vehiclemanage')));

const ProfilePage = Loadable(lazy(() => import('../pages/profile')));
const EditProfile = Loadable(lazy(() => import('../pages/profile/edit')));

const CreateCar = Loadable(lazy(() => import('../pages/vehiclemanage/create')));
const CarEdit = Loadable(lazy(() => import('../pages/vehiclemanage/edit')));
const Rent = Loadable(lazy(() => import('../pages/carsearch')));
const CarDetails = Loadable(lazy(() => import('../pages/carsearch/cartype')));
const Booking = Loadable(lazy(() => import('../pages/carsearch/booking')));
const Payment = Loadable(lazy(() => import('../pages/carsearch/payment')));
const ManageRentPage = Loadable(lazy(() => import('../pages/rentmanage'))); // Ensure this is correctly loaded

const EmployeePage = Loadable(lazy(() => import("../pages/employee")));
const CreateEmployee = Loadable(lazy(() => import("../pages/employee/create")));
const EditEmployee = Loadable(lazy(() => import("../pages/employee/edit")));

const LeavePage = Loadable(lazy(() => import("../pages/Leave")));
const CreateLeavePage = Loadable(lazy(() => import("../pages/Leave/create")));

const History = Loadable(lazy(() => import('../pages/history')));
const Review = Loadable(lazy(() => import('../pages/review')));
const ReviewAll = Loadable(lazy(() => import('../pages/reviewall')));

const LeavePageId = Loadable(lazy(() => import("../pages/profile/leave")))
const CreateLeaves = Loadable(lazy(() => import("../pages/profile/leave/create")))

const Adminreport = Loadable(lazy(() => import('../pages/adminreport')));
const Report = Loadable(lazy(() => import('../pages/report')));

// const
const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: '/',
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/vehiclemanage',
        children: [
          {
            path: '',
            element: <Vehiclemanage />,
          },
          {
            path: 'create',
            element: <CreateCar />,
          },
          {
            path: 'edit/:id',
            element: <CarEdit />,
          },
        ],
      },
      {
        path: '/profile',
        children: [
          {
            path: '',
            element: <ProfilePage />,            
          },
          {
            path: 'edit/:id',
            element: <EditProfile />,            
          },
          {
            path: 'leave/create',
            element: <CreateLeaves />,            
          },
          {
            path: 'leave',
            element: <LeavePageId />,            
          },
        ]

      },
      {
        path: '/history/:id',
        element: <History />,
      },
      {
        path: '/review/:id',
        element: <Review />,
      },
      {
        path: '/reviewall',
        element: <ReviewAll />,
      },
      {
        path: '/adminreport',
        element: <Adminreport />,
      },
      {
        path: '/report',
        element: <Report />,
      },
      {
        path: '/employee', // Base route for employee-related views
        children: [
          {
            path: '', // Default child route
            element: <EmployeePage />,
          },
          {
            path: "create",
            element: <CreateEmployee />,
          },
          {
            path: "edit/:id", // Dynamic route for editing specific employee
            element: <EditEmployee />,
          },
        ],
      },
      {
        path: '/rent',
        children: [
          {
            path: '',
            element: <Rent />,
          },
          {
            path: 'type/:type',
            element: <CarDetails />,
          },
          {
            path: 'booking/:carId',
            element: <Booking />,
          },
          {
            path: 'payment/:bookingId',
            element: <Payment />,
          },
        ],
      },
      {
        path: '/rentmanager',
        element: <ManageRentPage />,
      },
      {
        path: '/Leave',
        children: [
          {
            path: '',
            element: <LeavePage />,
          },
           {
             path: "create",
             element: <CreateLeavePage />,
           },
          // {
          //   path: "edit/:id", // Dynamic route for editing specific employee
          //   element: <EditLeave />,
          // },
        ]
      }
    ],
  };
};

export default AdminRoutes;
