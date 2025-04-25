import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WasteMenu from '../../foodWasteManagement/WasteMenu';
import ListMenu from '../../listManagement/listMenu';
import InventryMenu from '../../inventoryManagement/inventoryMenu';
import CategoryMenu from '../../categoryManagement/CategoryMenu';

import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation, useUpdateProfileMutation } from '../../services/authApi';
import { selectCurrentUser, updateUser } from '../../slice/authSlice';
import Profile from '../Profile';

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
import UserMenu from '../../userManagement/userMenu';
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
  const user = useSelector(selectCurrentUser);

  const dashboardCards = [
    {
      title: 'Waste Management',
      icon: <DeleteOutlined />,
      path: '/waste-management',
      description: 'Track and reduce food waste',
      color: token.colorPrimary
    },
    {
      title: 'Items Management',
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
      path: '/budget-management',
      description: 'Track your expenses',
      color: '#eb2f96'
    },
    {
      title: 'Reports',
      icon: <BarChartOutlined />,
      path: '/reports',
      description: 'View analytics',
      color: '#1890ff'
    },
    ...(user?.role === 'admin' ? [{
      title: 'User Management',
      icon: <TeamOutlined />,
      path: '/user-management',
      description: 'Manage system users',
      color: '#f5222d'
    }] : [])
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
{/* 
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
      </Row> */}
    </div>
  );
};

const baseMenuItems = [
  {
    key: '1',
    icon: <AppstoreOutlined />,
    label: 'Dashboard',
    component: DashboardView
  },
  {
    key: '4',
    icon: <ShoppingOutlined />,
    label: 'Inventory Management',
    component: InventryMenu,
    path: '/inventory-management'
  },
  {
    key: '3',
    icon: <OrderedListOutlined />,
    label: 'Items Management',
    component: ListMenu,
    path: '/list-management'
  },
  {
    key: '8',
    icon: <DollarOutlined />,
    label: 'Budget',
    component: WasteMenu,
    path: '/budget-management'
  },
  // {
  //   key: '9',
  //   icon: <AppstoreAddOutlined />,
  //   label: 'Category',
  //   component: CategoryMenu,
  //   path: '/category-management'
  // },
  {
    key: '2',
    icon: <DeleteOutlined />,
    label: 'Waste Management',
    component: WasteMenu,
    path: '/waste-management'
  },
];


const MainDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const updatedUser = useSelector(updateUser)
  const [logout] = useLogoutMutation();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();

  const menuItems = [
    ...baseMenuItems,
    ...(user.role === 'admin'
      ? [{
          key: '9',
          icon: <SettingOutlined />,
          label: 'User Management',
          component: UserMenu, 
          path: '/user-management'
        }]
      : [])
  ];
  
  useEffect(() => {
    const authDataString = localStorage.getItem('auth');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);  
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('auth');
      }
    } else {
      console.log('No auth data found in localStorage');
    }
  },[])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // const handleProfileUpdate = (updatedUser) => {
  //   dispatch(updateUser(updatedUser)); // Dispatch the updateUser action
  // };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await updateProfile(updatedData).unwrap();
      dispatch(updateUser(response.user));
      setIsProfileModalVisible(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };
  
  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('auth');
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
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

  const userMenuItems = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => setIsProfileModalVisible(true)
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    }
  ];


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
          {collapsed ? 'MD' : 'Main Dashboard'}
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
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
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
                {user?.profilePicture ? (
                  <Avatar
                    src={user.profilePicture}
                    style={{
                      marginRight: !collapsed ? '8px' : 0
                    }}
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: token.colorPrimary,
                      marginRight: !collapsed ? '8px' : 0
                    }}
                  />
                )}
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                    <Text strong style={{ lineHeight: '1.2' }}>
                      {user?.username || user?.name || 'User'} {/* Fallback to name if username not available */}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User'}
                    </Text>
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
      <Profile
        user={user}
        visible={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        onUpdate={handleProfileUpdate}
        updateProfile={updateProfile}
      />
    </Layout>
  );
};

export default MainDashboard;