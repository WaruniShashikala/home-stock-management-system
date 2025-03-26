import React, { useState } from 'react';
import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
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

const DevicesView = () => (
  <div>
    <h2>Devices Management</h2>
    <Card>
      <p>This is where you would manage your connected devices.</p>
    </Card>
  </div>
);

const ProjectsView = () => (
  <div>
    <h2>Projects</h2>
    <Card>
      <p>Your projects would be displayed here.</p>
    </Card>
  </div>
);

const MessagesView = ({ subItem }) => (
  <div>
    <h2>Messages - {subItem}</h2>
    <Card>
      <p>Content for {subItem} messages would appear here.</p>
    </Card>
  </div>
);

const TeamView = ({ subItem }) => (
  <div>
    <h2>Team - {subItem}</h2>
    <Card>
      <p>Team {subItem} management would appear here.</p>
    </Card>
  </div>
);

const DocumentsView = () => (
  <div>
    <h2>Documents</h2>
    <Card>
      <p>Document management interface would appear here.</p>
    </Card>
  </div>
);

const menuItems = [
  { key: '1', icon: <PieChartOutlined />, label: 'Dashboard', component: DashboardView },
  { key: '2', icon: <DesktopOutlined />, label: 'Devices', component: DevicesView },
  { key: '3', icon: <ContainerOutlined />, label: 'Projects', component: ProjectsView },
  {
    key: 'sub1',
    label: 'Messages',
    icon: <MailOutlined />,
    children: [
      { key: '5', label: 'Inbox', component: MessagesView, props: { subItem: 'Inbox' } },
      { key: '6', label: 'Sent', component: MessagesView, props: { subItem: 'Sent' } },
      { key: '7', label: 'Drafts', component: MessagesView, props: { subItem: 'Drafts' } },
      { key: '8', label: 'Trash', component: MessagesView, props: { subItem: 'Trash' } },
    ],
  },
  {
    key: 'sub2',
    label: 'Team',
    icon: <TeamOutlined />,
    children: [
      { key: '9', label: 'Members', component: TeamView, props: { subItem: 'Members' } },
      { key: '10', label: 'Groups', component: TeamView, props: { subItem: 'Groups' } },
      {
        key: 'sub3',
        label: 'Settings',
        children: [
          { key: '11', label: 'Permissions', component: TeamView, props: { subItem: 'Permissions' } },
          { key: '12', label: 'Roles', component: TeamView, props: { subItem: 'Roles' } },
        ],
      },
    ],
  },
  { key: '13', icon: <FileOutlined />, label: 'Documents', component: DocumentsView },
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

const Dashboard = () => {
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
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold',
          backgroundColor: '#fff'
        }}>
          {collapsed ? 'AD' : 'Admin Dashboard'}
        </div>
        <Menu
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={onMenuSelect}
          onOpenChange={onOpenChange}
          mode="inline"
          theme="dark"
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
                color: 'aqua'
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

export default Dashboard;