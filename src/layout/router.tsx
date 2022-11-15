import React, { Suspense, lazy } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

// 懒加载组件,快速导入工具函数
const lazyLoad = (moduleName: string) => {
  const Module = lazy(() => import(`../pages/${moduleName}`));
  return (
    <Suspense>
      <Module />
    </Suspense>
  );
};

export type IRoutesChildren = {
  label: string;
  path: string;
  link: string;
  element: JSX.Element;
};

export type IRoutes = {
  path: string;
  label: string;
  element: JSX.Element;
  children: IRoutesChildren[];
};

export const routes: IRoutes[] = [
  {
    path: '/',
    label: '测试目录',
    element: <Outlet />,
    children: [
      {
        label: '主页',
        path: 'home',
        link: '/home',
        element: lazyLoad('home'),
      },
      {
        label: '关于我们',
        path: 'about',
        link: '/about',
        element: lazyLoad('about'),
      },
    ],
  },
];

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((item: any) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
};

export default AppRouter;
