// import { createBrowserRouter } from "react-router-dom";

// import App from "../MainCompontent/App.jsx";

// import Homepage from "../Homepage.jsx";
// import Destinations from "../HomeCompontent/Destinations.jsx";
// import LandingPage from "../HomeCompontent/LandingPage.jsx";
// import ThankYou from "../HomeCompontent/ThankYou.jsx";
// import Shop from "../HomeCompontent/Shopwithus.jsx";
// import Contact from "../Page/Contact.jsx";
// import About from "../Page/About.jsx";
// import Testimonials from "../Page/Testimonials.jsx";
// import Business from "../Page/Business.jsx";
// import FeedbackForm from "../Page/FeedbackForm.jsx";
// import Register from "../User/Register.jsx";
// import Login from "../User/Login.jsx";
// import ForgetPassword from "../User/ForgotPassword.jsx";
// import ResetPassword from "../User/ResetPassword.jsx";

// import DashboardHome from "../Dashboard/Compontent/DashboardHome.jsx";
// import Adminlayout from "../Admin/Adminlayout.jsx";
// import AdminLogin from "../Admin/AdminLogin.jsx";

// import Enquiry from "../Page/Enquiry.jsx";
// import BlogPage from "../Page/BlogPage.jsx";
// import BlogDetails from "../Page/BlogDetails.jsx";
// import State from "../Page/State.jsx";
// import CountryState from "../Page/CountryState.jsx";
// import TourDetails from "../Page/TourDetails.jsx";
// import CountryTourDetails from "../Page/CountryTourDetails.jsx";

// import AdminBlog from "../Dashboard/page/AdminBlog.jsx";
// import AdminFeedback from "../Dashboard/page/AdminFeedback.jsx";
// import CatagoryIndia from "../Dashboard/page/CatagoryIndia.jsx";
// import AdminState from "../Dashboard/page/AdminState.jsx";
// import AdminAsia from "../Dashboard/page/Adminasia.jsx";
// import AdminTours from "../Dashboard/page/AdminTours.jsx";
// import AdminCountry from "../Dashboard/page/AdminCountry.jsx";
// import AdminFaqState from "../Dashboard/page/AdminFaqState.jsx";
// import AdminFaqCountry from "../Dashboard/page/AdminFaqCountry.jsx";
// import AdminDashboard from "../Dashboard/page/AdminDashboard.jsx";
// import UserManagement from "../Dashboard/page/UserManagement.jsx";
// import AdminEnquiry from "../Dashboard/page/AdminEnquiry.jsx";
// import AdminAsiaState from "../Dashboard/page/AdminAsiaState.jsx";
// import AdminContact from "../Dashboard/page/AdminContact.jsx";
// import AdminEdit from "../Dashboard/page/AdminEdit.jsx";

// import UserdHome from "../User/Dashboard/UserHome.jsx";
// import UserDashboard from "../User/Dashboard/UserDashboard.jsx";
// import Profile from "../User/Dashboard/Profile.jsx";
// import UserEdit from "../User/Dashboard/UserEdit.jsx";

// import AdminProtectedRoute from "../Dashboard/Compontent/AdminProtectedRoute.jsx";
// import UserProtectedRoute from "../User/UserProtectedRoute.jsx";

// import PrivacyPolicy from "../Page/PrivacyPolicy.jsx";
// import TermsCondition from "../Page/TermsCondition.jsx";
// import Payment from "../Page/Payment.jsx";

// import Announcements from "../User/Dashboard/Announcements.jsx";
// import PaymentModel from "../User/Dashboard/PaymentModel.jsx";

// import AdminPayments from "../Dashboard/page/AdminPayments.jsx";
// import AdminBussianContent from "../Dashboard/page/AdminBussianContent.jsx";

// import UserDocument from "../User/UserDocument.jsx";

// const router = createBrowserRouter([
//   // ✅ MAIN WEBSITE LAYOUT (App contains Header/TopHeader/Footer)
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { index: true, element: <Homepage /> },
//       { path: "destinations", element: <Destinations /> },
//       { path: "shop", element: <Shop /> },
//       { path: "contact-us", element: <Contact /> },
//       { path: "about-us", element: <About /> },
//       { path: "testimonials", element: <Testimonials /> },
//       { path: "business-with-us", element: <Business /> },
//       { path: "register", element: <Register /> },
//       { path: "login", element: <Login /> },
//       { path: "enquiry-form", element: <Enquiry /> },
//       { path: "feedback-form", element: <FeedbackForm /> },
//       { path: "forgot-password", element: <ForgetPassword /> },
//       { path: "reset-password/:token", element: <ResetPassword /> },
//       { path: "blogpage", element: <BlogPage /> },
//       { path: "blog/:id", element: <BlogDetails /> },

//       { path: "india-tours/state/:stateId/:stateName", element: <State /> },
//       { path: "india-tours/:stateId/:stateName", element: <State /> },
//       { path: "asia-tours/:countryId", element: <CountryState /> },
//       { path: "tour/:tourId", element: <TourDetails /> },
//       {
//         path: "country/:countryId/:asiastateId/:stateName",
//         element: <CountryTourDetails />,
//       },

//       { path: "privacypolicy", element: <PrivacyPolicy /> },
//       { path: "termscondition", element: <TermsCondition /> },
//       { path: "payment", element: <Payment /> },
//     ],
//   },

//   // ✅ NO HEADER / NO FOOTER ROUTES (Landing + ThankYou)
//   { path: "/landingpage", element: <LandingPage /> },
//   { path: "/thankyou", element: <ThankYou /> },

//   // ✅ ADMIN ROUTES
//   {
//     path: "/admin",
//     element: <Adminlayout />,
//     children: [
//       { index: true, element: <AdminLogin /> },
//       {
//         path: "dashboard",
//         element: (
//           <AdminProtectedRoute>
//             <DashboardHome />
//           </AdminProtectedRoute>
//         ),
//         children: [
//           { index: true, element: <AdminDashboard /> },
//           { path: "adminblog", element: <AdminBlog /> },
//           { path: "adminfeedback", element: <AdminFeedback /> },
//           { path: "catagoryindia", element: <CatagoryIndia /> },
//           { path: "Itinerary", element: <AdminState /> },
//           { path: "adminasia", element: <AdminAsia /> },
//           { path: "admintours", element: <AdminTours /> },
//           { path: "admincountry", element: <AdminCountry /> },
//           { path: "adminfaq", element: <AdminFaqState /> },
//           { path: "adminfaqcountry", element: <AdminFaqCountry /> },
//           { path: "usermanagement", element: <UserManagement /> },
//           { path: "adminenquiry", element: <AdminEnquiry /> },
//           { path: "adminasiastate", element: <AdminAsiaState /> },
//           { path: "admincontact", element: <AdminContact /> },
//           { path: "adminprofile", element: <AdminEdit /> },
//           { path: "adminPayments", element: <AdminPayments /> },
//           { path: "AdminBussianContent", element: <AdminBussianContent /> },
//         ],
//       },
//     ],
//   },

//   // ✅ USER ROUTES
//   {
//     path: "/user",
//     element: <UserProtectedRoute />,
//     children: [
//       {
//         element: <UserdHome />,
//         children: [
//           { index: true, element: <UserDashboard /> },
//           { path: "profile", element: <Profile /> },
//           { path: "edit", element: <UserEdit /> },
//           { path: "announcement", element: <Announcements /> },
//           { path: "PaymentModel", element: <PaymentModel /> },
//           { path: "UserDocument", element: <UserDocument /> },
//         ],
//       },
//     ],
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";

import App from "../MainCompontent/App.jsx";

import Homepage from "../Homepage.jsx";
import Destinations from "../HomeCompontent/Destinations.jsx";
import LandingPage from "../HomeCompontent/LandingPage.jsx";
import ThankYou from "../HomeCompontent/ThankYou.jsx";
import Shop from "../HomeCompontent/Shopwithus.jsx";
import Contact from "../Page/Contact.jsx";
import About from "../Page/About.jsx";
import Testimonials from "../Page/Testimonials.jsx";
import Business from "../Page/Business.jsx";
import FeedbackForm from "../Page/FeedbackForm.jsx";
import Register from "../User/Register.jsx";
import Login from "../User/Login.jsx";
import ForgetPassword from "../User/ForgotPassword.jsx";
import ResetPassword from "../User/ResetPassword.jsx";

import DashboardHome from "../Dashboard/Compontent/DashboardHome.jsx";
import Adminlayout from "../Admin/Adminlayout.jsx";
import AdminLogin from "../Admin/AdminLogin.jsx";

import Enquiry from "../Page/Enquiry.jsx";
import BlogPage from "../Page/BlogPage.jsx";
import BlogDetails from "../Page/BlogDetails.jsx";
import State from "../Page/State.jsx";
import CountryState from "../Page/CountryState.jsx";
import TourDetails from "../Page/TourDetails.jsx";
import CountryTourDetails from "../Page/CountryTourDetails.jsx";

import AdminBlog from "../Dashboard/page/AdminBlog.jsx";
import AdminFeedback from "../Dashboard/page/AdminFeedback.jsx";
import CatagoryIndia from "../Dashboard/page/CatagoryIndia.jsx";
import AdminState from "../Dashboard/page/AdminState.jsx";
import AdminAsia from "../Dashboard/page/Adminasia.jsx";
import AdminTours from "../Dashboard/page/AdminTours.jsx";
import AdminCountry from "../Dashboard/page/AdminCountry.jsx";
import AdminFaqState from "../Dashboard/page/AdminFaqState.jsx";
import AdminFaqCountry from "../Dashboard/page/AdminFaqCountry.jsx";
import AdminDashboard from "../Dashboard/page/AdminDashboard.jsx";
import UserManagement from "../Dashboard/page/UserManagement.jsx";
import AdminEnquiry from "../Dashboard/page/AdminEnquiry.jsx";
import AdminAsiaState from "../Dashboard/page/AdminAsiaState.jsx";
import AdminContact from "../Dashboard/page/AdminContact.jsx";
import AdminEdit from "../Dashboard/page/AdminEdit.jsx";

import UserdHome from "../User/Dashboard/UserHome.jsx";
import UserDashboard from "../User/Dashboard/UserDashboard.jsx";
import Profile from "../User/Dashboard/Profile.jsx";
import UserEdit from "../User/Dashboard/UserEdit.jsx";

import AdminProtectedRoute from "../Dashboard/Compontent/AdminProtectedRoute.jsx";
import UserProtectedRoute from "../User/UserProtectedRoute.jsx";

import PrivacyPolicy from "../Page/PrivacyPolicy.jsx";
import TermsCondition from "../Page/TermsCondition.jsx";
import Payment from "../Page/Payment.jsx";

import Announcements from "../User/Dashboard/Announcements.jsx";
import PaymentModel from "../User/Dashboard/PaymentModel.jsx";

import AdminPayments from "../Dashboard/page/AdminPayments.jsx";
import AdminBussianContent from "../Dashboard/page/AdminBussianContent.jsx";

import UserDocument from "../User/UserDocument.jsx";
import PageNotFound from "../Page/PageNotFound.jsx";

const router = createBrowserRouter([
  // ✅ MAIN WEBSITE LAYOUT (App contains Header/TopHeader/Footer)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "destinations", element: <Destinations /> },
      { path: "shop", element: <Shop /> },
      { path: "contact-us", element: <Contact /> },
      { path: "about-us", element: <About /> },
      { path: "testimonials", element: <Testimonials /> },
      { path: "business-with-us", element: <Business /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "enquiry-form", element: <Enquiry /> },
      { path: "feedback-form", element: <FeedbackForm /> },
      { path: "forgot-password", element: <ForgetPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "blogpage", element: <BlogPage /> },
      { path: "blog/:id", element: <BlogDetails /> },

      { path: "india-tours/state/:stateId/:stateName", element: <State /> },
      { path: "india-tours/:stateId/:stateName", element: <State /> },
      { path: "asia-tours/:countryId", element: <CountryState /> },
      { path: "tour/:tourId", element: <TourDetails /> },
      {
        path: "country/:countryId/:asiastateId/:stateName",
        element: <CountryTourDetails />,
      },

      { path: "privacypolicy", element: <PrivacyPolicy /> },
      { path: "termscondition", element: <TermsCondition /> },
      { path: "payment", element: <Payment /> },
    ],
  },

  // ✅ NO HEADER / NO FOOTER ROUTES (Landing + ThankYou)
  { path: "/landingpage", element: <LandingPage /> },
  { path: "/thankyou", element: <ThankYou /> },

  // ✅ ADMIN ROUTES
  {
    path: "/admin",
    element: <Adminlayout />,
    children: [
      { index: true, element: <AdminLogin /> },
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <DashboardHome />
          </AdminProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "adminblog", element: <AdminBlog /> },
          { path: "adminfeedback", element: <AdminFeedback /> },
          { path: "catagoryindia", element: <CatagoryIndia /> },
          { path: "Itinerary", element: <AdminState /> },
          { path: "adminasia", element: <AdminAsia /> },
          { path: "admintours", element: <AdminTours /> },
          { path: "admincountry", element: <AdminCountry /> },
          { path: "adminfaq", element: <AdminFaqState /> },
          { path: "adminfaqcountry", element: <AdminFaqCountry /> },
          { path: "usermanagement", element: <UserManagement /> },
          { path: "adminenquiry", element: <AdminEnquiry /> },
          { path: "adminasiastate", element: <AdminAsiaState /> },
          { path: "admincontact", element: <AdminContact /> },
          { path: "adminprofile", element: <AdminEdit /> },
          { path: "adminPayments", element: <AdminPayments /> },
          { path: "AdminBussianContent", element: <AdminBussianContent /> },
        ],
      },
    ],
  },

  // ✅ USER ROUTES
  {
    path: "/user",
    element: <UserProtectedRoute />,
    children: [
      {
        element: <UserdHome />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "edit", element: <UserEdit /> },
          { path: "announcement", element: <Announcements /> },
          { path: "PaymentModel", element: <PaymentModel /> },
          { path: "UserDocument", element: <UserDocument /> },
        ],
      },
    ],
  },

  // ✅ Catch-all route → 404 Page
  { path: "*", element: <PageNotFound /> },
]);

export default router;

