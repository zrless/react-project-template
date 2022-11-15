import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
const { Content, Sider } = Layout;
import AppRouter, { routes } from './router';
import type { IRoutesChildren, IRoutes } from './router';

const items: MenuProps['items'] = routes.map((route: IRoutes) => ({
  key: route.path,
  label: route.label,
  children: route.children.map((item: IRoutesChildren) => {
    return {
      key: item.link,
      label: <NavLink to={item.link}>{item.label}</NavLink>,
    };
  }),
}));

const BasicLayout: React.FC = () => {
  const location = useLocation();
  const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setMenuSelectedKeys([location.pathname]);
    routes.forEach((item: IRoutes) => {
      (item.children || []).forEach((cItem: IRoutesChildren) => {
        if (cItem.link === location.pathname) {
          setMenuOpenKeys([item.path]);
        }
      });
    });
  }, [location]);

  return (
    <Layout hasSider>
      <Sider
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu
          style={{ height: '100vh' }}
          mode="inline"
          defaultOpenKeys={menuOpenKeys}
          // openKeys={menuOpenKeys}
          selectedKeys={menuSelectedKeys}
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: 200, background: ' #ffffff', padding: 10 }}>
        <Content>
          <AppRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
