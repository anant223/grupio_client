import React, {lazy} from "react";
import { createBrowserRouter, Navigate } from "react-router-dom"
import PublicRoute  from "./PublicRoute";
import MainRoute from "./MainRoute";

const MainLayout = lazy(() => import("@/Layouts/MainLayout"));
const AuthLayout = lazy(() => import("@/Layouts/AuthLayout"));

const Home = lazy(() => import( "@/pages/Home"));
const Auth = lazy(() => import("@/pages/Auth"));
const Profile = lazy(() => import("../pages/Profile"));
const EventFrom = lazy(() => import("../pages/EventFrom"));
const Events = lazy(() => import("../pages/Events"));
const EventDetail = lazy(() => import("../pages/EventDetail"));
// const Checkout = lazy(() => import("../pages/Checkout"))
// const PaymentSuccess = lazy(() => import("../pages/paymentSuccess"))
const OnBoarding = lazy(() => import("@/pages/OnBoarding"));
// const Notification = lazy(() => import("@/pages/Notification"));
const Settings = lazy(() => import("../pages/Settings"));
// const Verify = lazy(() => import("../pages/Verifying"));
const ForgetPassword = lazy(() => import("../pages/ForgetPassword"))
const ResetPassword = lazy(() => import("../pages/ResetPassword"))
const Welcome = lazy(() => import("../pages/Welcome"))
const AppRouting = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  // {
  //   path: "verifying-request",
  //   element: <Verify />,
  // },
  {
    path: "/onboarding",
    element: <OnBoarding />,
  },
  {
    path: "/🎉",
    element: <Welcome />,
  },
  {
    path: "/main",
    element: (
      <MainRoute>
        <MainLayout />
      </MainRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="all-events" />,
      },
      {
        path: "all-events",
        element: <Events />,
      },
      // {
      //   path: "notifications",
      //   element: <Notification />,
      // },
      {
        path: "user-profile/:id",
        element: <Profile />,
      },
      {
        path: "create-form",
        element: <EventFrom />,
      },
      {
        path: "event/:id",
        element: <EventDetail />,
      },
      // {
      //   path: "checkout",
      //   element: <Checkout />,
      // },
      // {
      //   path: "payment-success",
      //   element: <PaymentSuccess />,
      // },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
export default AppRouting;