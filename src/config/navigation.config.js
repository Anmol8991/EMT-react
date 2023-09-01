const navigationConfig = [
    {
        key: 'admin.dashboard',
        type: 'item',
        title: 'Dashboard',
        icon: 'bi bi-speedometer fs-2',
        path: '/admin/dashboard',
        authority: ['admin'],
        subMenu:[]
    },
    {
        key: 'admin.employees',
        type: 'item',
        title: 'Employees',
        icon: 'bi bi-person fs-2',
        path: '/admin/allEmployees',
        authority: ['admin'],
        subMenu:[]
    },
    {
        key: 'admin.attendance',
        type: 'item',
        title: 'Attendance',
        icon: 'bi bi-calendar3 fs-2',
        path: '/admin/employeeAttendance',
        authority: ['admin'],
        subMenu:[]
    },
    {
        key: 'admin.salary',
        type: 'item',
        title: 'Salary',
        icon: 'bi bi-cash-stack fs-2',
        path: '/admin/salary',
        authority: ['admin'],
        subMenu:[]
    },
    {
        key: 'admin.settings',
        type: 'item',
        title: 'Settings',
        icon: 'bi bi-gear fs-2',
        path: '/admin/settings',
        authority: ['admin'],
        subMenu:[]
    },
    {
        key: 'user.dashboard',
        type: 'item',
        title: 'Dashboard',
        icon: 'bi bi-speedometer fs-2',
        path: '/user/dashboard',
        authority: ['user'],
        subMenu:[]
    },
    {
        key: 'user.attendance',
        type: 'item',
        title: 'Attendance',
        icon: 'bi bi-calendar3 fs-2',
        path: '/user/attendance',
        authority: ['user'],
        subMenu:[]
    },
    {
        key: 'user.salary',
        type: 'item',
        title: 'Salary',
        icon: 'bi bi-cash fs-2',
        path: '/user/salary',
        authority: ['user'],
        subMenu:[]
    },
    {
        key: 'user.leaves',
        type: 'item',
        title: 'Leaves',
        icon: 'bi bi-person-lines-fill fs-2',
        path: '/user/leaves',
        authority: ['user'],
        subMenu:[]
    },
]

export default navigationConfig