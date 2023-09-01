import { lazy } from "react";

export const publicRoutes = [
  {
    key: "signIn",
    path: "/sign-in",
    title: "Sign In",
    component: lazy(() => import("../views/auth/SignIn")),
    authority: [],
  },
  // {
  //     key: 'forgotPassword',
  //     path: `/forgot-password`,
  //     title:"Forgot Password",
  //     component: lazy(() => import('@/views/auth/ForgotPassword')),
  //     authority: [],
  // },
  // {
  //     key: 'resetPassword',
  //     path: `/reset-password`,
  //     title:"Reset Password",
  //     component: lazy(() => import('@/views/auth/ResetPassword')),
  //     authority: [],
  // },
];

export const protectedRoutes = [
  {
    key: "profile",
    path: "/profile",
    title: "Profile",
    component: lazy(() => import("../views/Profile")),
    authority: ["admin", "user"],
  },
  {
    key: "admin.dashboard",
    path: "/admin/dashboard",
    title: "Dashboard",
    component: lazy(() => import("../views/dashboard/admin/Admin")),
    authority: ["admin"],
  },
  {
    key: "admin.employees",
    path: "/admin/allEmployees",
    title: "Employees",
    component: lazy(() => import("../views/admin/AllEmployees")),
    authority: ["admin"],
  },
  {
    key: "admin.addUser",
    path: "/admin/addEmployee",
    title: "Add User",
    component: lazy(() =>
      import("../views/admin/components/employees/AddEmployee")
    ),
    authority: ["admin"],
  },
  {
    key: "admin.addUser",
    path: "/admin/employeeDetails/:id",
    title: "Add User",
    component: lazy(() =>
      import("../views/admin/components/employees//EmployeeDetails")
    ),
    authority: ["admin"],
  },
  {
    key: "admin.attendance",
    path: "/admin/employeeAttendance",
    title: "Attendance",
    component: lazy(() => import("../views/admin/Attendance")),
    authority: ["admin"],
  },
  {
    key: "admin.salary",
    path: "/admin/salary",
    title: "Salary",
    component: lazy(() => import("../views/admin/Attendance")),
    authority: ["admin"],
  },
  {
    key: "admin.settings",
    path: "/admin/settings",
    title: "Settings",
    component: lazy(() => import("../views/admin/Settings")),
    authority: ["admin"],
  },
  {
    key: "user.updatePassword",
    path: "/user/updatePassword",
    title: "Update Password",
    component: lazy(() => import("../views/user/UpdatePassword")),
    authority: ["user"],
  },
  {
    key: "user.dashboard",
    path: "/user/dashboard",
    title: "Dashboard",
    component: lazy(() => import("../views/dashboard/user/User")),
    authority: ["user"],
  },
  {
    key: "user.attendance",
    path: "/user/attendance",
    title: "Attendance",
    component: lazy(() => import("../views/user/Attendance")),
    authority: ["user"],
  },
  {
    key: "user.salary",
    path: "/user/salary",
    title: "Salary",
    component: lazy(() => import("../views/dashboard/user/User")),
    authority: ["user"],
  },
  {
    key: "user.leaves.apply",
    path: "/user/leaves",
    title: "Leaves",
    component: lazy(() => import("../views/user/Leaves")),
    authority: ["user"],
  },
];
