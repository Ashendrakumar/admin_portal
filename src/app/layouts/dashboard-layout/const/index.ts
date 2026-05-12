export const DASHBOARD_LAYOUT = {
  NAV_ITEMS: [
    {
      section: "Main",
      items: [
        {
          title: "Overview",
          path: "/dashboard/overview",
          icon: "dashboard",
          disabled: false,
          exact: false,
        },
        {
          title: "Users",
          path: "/dashboard",
          icon: "users",
          disabled: false,
          exact: true,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          title: "Analytics",
          path: "#",
          icon: "analytics",
          disabled: true,
          exact: false,
        },
        {
          title: "Settings",
          path: "#",
          icon: "settings",
          disabled: true,
          exact: false,
        },
      ],
    },
  ],
};
