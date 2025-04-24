import React, { useState } from 'react';
import Dashboard from './dashboard';
import wasteList from './wasteList';
import Donation from './donation';
import report from './report';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  HeartOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import Profile from '../compoments/Profile';
import { useUpdateProfileMutation } from '../services/authApi';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../slice/authSlice';
import { Link } from 'react-router-dom';
import { Button, Menu, Layout, Dropdown, Avatar, Badge, Space, Card, Table, Statistic, Typography } from 'antd';
const { Header, Sider, Content } = Layout;
const { Text } = Typography;


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
  { key: '2', icon: <PlusCircleOutlined />, label: 'Log Waste', component: wasteList },
  { key: '3', icon: <BarChartOutlined />, label: 'Reports', component: report },
  { key: '4', icon: <HeartOutlined />, label: 'Donations', component: Donation },
];


const WasteMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useDispatch();

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

  const findComponentByKey = (key) => {
    return menuItems.find(item => item.key === key);
  };

  const handleProfileUpdate = async (updatedData) => {
    // try {
    //   const response = await updateProfile(updatedData).unwrap();
    //   dispatch(updateUser(response.user));
    //   setIsProfileModalVisible(false);
    // } catch (err) {
    //   console.error('Failed to update profile:', err);
    // }
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
        <Link to='/dashboard'>
          <div className="logo" style={{
            height: '64px',
            display: 'flex',
            color: '#4531e8',
            fontSize: collapsed ? '16px' : '20px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            marginLeft: '28px'
          }}>
            {collapsed ? 'WL' : 'Waste Log'}
          </div>
        </Link>
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
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                ':hover': {
                  backgroundColor: '#f5f5f5'
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
                      marginRight: !collapsed ? '8px' : 0
                    }}
                  />
                )}
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{user?.username || user?.name || 'User'}</Text>
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
          background: '#fff',
          borderRadius: 4
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

export default WasteMenu;