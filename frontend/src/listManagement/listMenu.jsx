import React, { useState } from 'react';
import FoodList from './foodList';
import Dashboard from './Dashboard';
import Report from './report';
import ShoppingList from './shoppingList';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  OrderedListOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { Button, Menu, Layout, Dropdown, Avatar, Badge, Space, Card, Table, Statistic } from 'antd';
const { Header, Sider, Content } = Layout;


// Components for different views
const DashboardView = () => (
  <div>
    <h2>Dashboard Overview</h2>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <div className="site-statistic-demo-card">
        <Space size="large">
          <Card>
            <Statistic title="Active Users" value={1128} />
          </Card>
          <Card>
            <Statistic title="Total Projects" value={93} />
          </Card>
          <Card>
            <Statistic title="Tasks Completed" value={256} />
          </Card>
        </Space>
      </div>
      <Card title="Recent Activity">
        <Table 
          columns={[
            { title: 'Event', dataIndex: 'event' },
            { title: 'Time', dataIndex: 'time' }
          ]}
          dataSource={[
            { key: '1', event: 'Project X launched', time: '2 hours ago' },
            { key: '2', event: 'New user registered', time: '4 hours ago' },
            { key: '3', event: 'System update completed', time: '1 day ago' }
          ]}
          size="small"
        />
      </Card>
    </Space>
  </div>
);


const menuItems = [
  { key: '1', icon: <AppstoreOutlined />, label: 'Dashboard', component: Dashboard },
  { key: '2', icon: <PlusCircleOutlined/>, label: 'Food List', component: FoodList },
  { key: '3', icon: <OrderedListOutlined />, label: 'Shopping List', component: ShoppingList },
  { key: '4', icon: <BarChartOutlined/>, label: 'Report', component:  Report},
];

const userMenuItems = [
  {
    key: '1',
    label: 'Profile',
    icon: <UserOutlined />
  },
  {
    key: '2',
    label: 'Settings',
    icon: <SettingOutlined />
  },
  {
    type: 'divider'
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogoutOutlined />,
    danger: true
  }
];

const notificationItems = [
  {
    key: '1',
    label: (
      <>
        <strong>New message</strong>
        <div>You have 1 new message</div>
      </>
    )
  },
  {
    key: '2',
    label: (
      <>
        <strong>System update</strong>
        <div>System will be updated at 3:00 AM</div>
      </>
    )
  }
];

const ListMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMenuSelect = ({ key }) => {
    setSelectedKeys([key]);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  // Find the current component to render based on selected key
  const findComponentByKey = (key) => {
    // Flatten all menu items including nested ones
    const flattenItems = (items) => {
      return items.reduce((acc, item) => {
        if (item.children) {
          return [...acc, item, ...flattenItems(item.children)];
        }
        return [...acc, item];
      }, []);
    };

    const allItems = flattenItems(menuItems);
    return allItems.find(item => item.key === key);
  };

  const selectedItem = findComponentByKey(selectedKeys[0]);
  const CurrentComponent = selectedItem?.component || DashboardView;
  const componentProps = selectedItem?.props || {};

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          backgroundColor: '#fff'
        }}
      >
        <div className="logo" style={{
          height: '64px',
          display: 'flex',
          color: '#4531e8',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          marginLeft: '28px'
        }}>
          {collapsed ? 'US' : 'Usage/Shopping'}
        </div>
        <Menu
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={onMenuSelect}
          onOpenChange={onOpenChange}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header style={{
          padding: 0,
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: '24px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#B8AFFF'
              }}
            />
          </div>
          
          <Space size="large">
            <Dropdown menu={{ items: notificationItems }} trigger={['click']}>
              <Badge count={5} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '16px' }} />}
                  style={{ width: 48 }}
                />
              </Badge>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                />
                {!collapsed && <span>Admin User</span>}
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: 4
        }}>
          <CurrentComponent {...componentProps} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ListMenu;