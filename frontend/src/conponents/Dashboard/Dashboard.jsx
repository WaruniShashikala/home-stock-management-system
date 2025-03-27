import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WasteMenu from '../../foodWasteManagement/WasteMenu';
import ListMenu from '../../listManagement/listMenu';
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
  PlusCircleOutlined,
  ShoppingOutlined,
  TeamOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { Button, Menu, Layout, Dropdown, Avatar, Badge, Space, Card, Table, Statistic, Row, Col, Typography, theme } from 'antd';
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Custom card component for dashboard tiles
const DashboardCard = ({ icon, title, description, onClick, color }) => {
  return (
    <Card 
      hoverable 
      onClick={onClick}
      style={{ 
        textAlign: 'center', 
        cursor: 'pointer',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        border: 'none',
        height: '100%'
      }}
      bodyStyle={{ padding: '24px 16px' }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        margin: '0 auto 16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${color}20`, // 20% opacity of the color
        color: color
      }}>
        {React.cloneElement(icon, { style: { fontSize: '28px' } })}
      </div>
      <Title level={4} style={{ marginBottom: '8px', color: '#1a1a1a' }}>{title}</Title>
      <Text type="secondary" style={{ color: '#666' }}>{description}</Text>
    </Card>
  );
};

// Components for different views
const DashboardView = ({ navigate }) => {
  const { token } = theme.useToken();
  
  const dashboardCards = [
    {
      title: 'Waste Management',
      icon: <DeleteOutlined />,
      path: '/waste-management',
      description: 'Track and reduce food waste',
      color: token.colorPrimary
    },
    {
      title: 'List Management',
      icon: <OrderedListOutlined />,
      path: '/list-management',
      description: 'Manage your shopping lists',
      color: '#52c41a'
    },
    {
      title: 'Inventory Management',
      icon: <ShoppingOutlined />,
      path: '/inventory-management',
      description: 'Track your food inventory',
      color: '#faad14'
    },
    {
      title: 'User Management',
      icon: <TeamOutlined />,
      path: '/user-management',
      description: 'Manage system users',
      color: '#f5222d'
    },
    {
      title: 'Shopping List',
      icon: <ShoppingCartOutlined />,
      path: '/shopping-list',
      description: 'Manage shopping items',
      color: '#722ed1'
    },
    {
      title: 'Categories',
      icon: <AppstoreAddOutlined />,
      path: '/categories',
      description: 'Organize your categories',
      color: '#13c2c2'
    },
    {
      title: 'Budget',
      icon: <DollarOutlined />,
      path: '/budget',
      description: 'Track your expenses',
      color: '#eb2f96'
    },
    {
      title: 'Reports',
      icon: <BarChartOutlined />,
      path: '/reports',
      description: 'View analytics',
      color: '#1890ff'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ color: token.colorTextHeading }}>Dashboard Overview</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>Welcome back! Here's what's happening today.</Text>
      </div>
      
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {dashboardCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <DashboardCard 
              icon={card.icon}
              title={card.title}
              description={card.description}
              onClick={() => navigate(card.path)}
              color={card.color}
            />
          </Col>
        ))}
      </Row>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            title="Recent Activity" 
            style={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
            headStyle={{ border: 'none', padding: '16px 24px' }}
            bodyStyle={{ padding: '0' }}
          >
            <Table 
              columns={[
                { title: 'Event', dataIndex: 'event', key: 'event' },
                { title: 'Time', dataIndex: 'time', key: 'time', width: '120px' }
              ]}
              dataSource={[
                { key: '1', event: 'Added new items to inventory', time: '2 hours ago' },
                { key: '2', event: 'User "John Doe" registered', time: '4 hours ago' },
                { key: '3', event: 'System maintenance completed', time: '1 day ago' },
                { key: '4', event: 'Weekly report generated', time: '2 days ago' },
                { key: '5', event: 'New category added', time: '3 days ago' }
              ]}
              size="middle"
              pagination={false}
              style={{ border: 'none' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Quick Stats" 
            style={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
            headStyle={{ border: 'none', padding: '16px 24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card bordered={false} bodyStyle={{ padding: '16px' }}>
                  <Statistic 
                    title="Active Users" 
                    value={1128} 
                    prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card bordered={false} bodyStyle={{ padding: '16px' }}>
                  <Statistic 
                    title="Items in Inventory" 
                    value={243} 
                    prefix={<ShoppingOutlined style={{ color: '#faad14' }} />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card bordered={false} bodyStyle={{ padding: '16px' }}>
                  <Statistic 
                    title="Shopping Items" 
                    value={27} 
                    prefix={<ShoppingCartOutlined style={{ color: '#722ed1' }} />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card bordered={false} bodyStyle={{ padding: '16px' }}>
                  <Statistic 
                    title="Waste Saved" 
                    value="45%" 
                    prefix={<DeleteOutlined style={{ color: '#52c41a' }} />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const menuItems = [
  { 
    key: '1', 
    icon: <AppstoreOutlined />, 
    label: 'Dashboard', 
    component: DashboardView 
  },
  { 
    key: '2', 
    icon: <DeleteOutlined />, 
    label: 'Waste Management', 
    component: WasteMenu,
    path: '/waste-management'
  },
  { 
    key: '3', 
    icon: <OrderedListOutlined />, 
    label: 'List Management', 
    component: ListMenu,
    path: '/list-management'
  },
  { 
    key: '4', 
    icon: <ShoppingOutlined />, 
    label: 'Inventory Management', 
    component: ListMenu,
    path: '/inventory-management'
  },
  { 
    key: '5', 
    icon: <TeamOutlined />, 
    label: 'User Management', 
    component: WasteMenu,
    path: '/user-management'
  },
  // { 
  //   key: '6', 
  //   icon: <ShoppingCartOutlined />, 
  //   label: 'Shopping List', 
  //   component: ListMenu,
  //   path: '/shopping-list'
  // },
  // { 
  //   key: '7', 
  //   icon: <AppstoreAddOutlined />, 
  //   label: 'Categories', 
  //   component: ListMenu,
  //   path: '/categories'
  // },
  // { 
  //   key: '8', 
  //   icon: <DollarOutlined />, 
  //   label: 'Budget', 
  //   component: WasteMenu,
  //   path: '/budget'
  // },
  // { 
  //   key: '9', 
  //   icon: <BarChartOutlined/>, 
  //   label: 'Reports', 
  //   component: WasteMenu,
  //   path: '/reports'
  // },
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

const MainDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const navigate = useNavigate();
  const { token } = theme.useToken();
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMenuSelect = ({ key }) => {
    const selectedItem = menuItems.find(item => item.key === key);
    if (selectedItem?.path) {
      navigate(selectedItem.path);
    }
    setSelectedKeys([key]);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const findComponentByKey = (key) => {
    return menuItems.find(item => item.key === key);
  };

  const selectedItem = findComponentByKey(selectedKeys[0]);
  const CurrentComponent = selectedItem?.component || DashboardView;
  const componentProps = { navigate, ...selectedItem?.props };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          backgroundColor: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)'
        }}
      >
        <div className="logo" style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          paddingLeft: collapsed ? '0' : '24px',
          color: token.colorPrimary,
          fontSize: collapsed ? '18px' : '20px',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          {collapsed ? 'DB' : 'Dashboard Pro'}
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
          style={{ 
            borderRight: 0,
            padding: '8px 0'
          }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 280 }}>
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
          zIndex: 1,
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: '18px',
                width: 64,
                height: 64,
                color: token.colorTextSecondary
              }}
            />
          </div>
          
          <Space size="large">
            <Dropdown menu={{ items: notificationItems }} trigger={['click']} overlayStyle={{ width: '300px' }}>
              <Badge count={5} size="small" style={{ 
                boxShadow: `0 0 0 2px ${token.colorBgContainer}`,
                cursor: 'pointer'
              }}>
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '18px', color: token.colorTextSecondary }} />}
                  style={{ width: 48 }}
                />
              </Badge>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                ':hover': {
                  backgroundColor: token.colorBgTextHover
                }
              }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: token.colorPrimary,
                    marginRight: !collapsed ? '8px' : 0
                  }}
                />
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                    <Text strong style={{ lineHeight: '1.2' }}>Admin User</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Administrator</Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: 'transparent'
        }}>
          <CurrentComponent {...componentProps} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDashboard;