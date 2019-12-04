export default [
  {
    path: '/',
    component: '../layouts/Danye',
    routes: [
      { path: '/', redirect: '/Index' },
      {
        path: '/index',
        name: 'index',
        routes: [
          {
            path: '/Index',
            name: 'index',
            component: './Index',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
