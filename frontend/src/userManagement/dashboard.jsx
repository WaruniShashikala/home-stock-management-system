import React from 'react';
import { Card, Row, Col, Typography, Avatar, Space, Statistic, Divider, Table, Tag, Progress } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyOutlined,
  EditOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useGetAllUsersQuery } from '../services/authApi';

const { Title, Text } = Typography;

function Dashboard() {
  // Fetch all users data
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  
  // Calculate statistics from users data
  const userStats = {
    totalUsers: users.length,
    adminCount: users.filter(user => user.role === 'admin').length,
    activeToday: users.filter(user => {
      const lastActive = new Date(user.lastActive || user.createdAt);
      return lastActive.toDateString() === new Date().toDateString();
    }).length,
    newThisWeek: users.filter(user => {
      const created = new Date(user.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return created > oneWeekAgo;
    }).length,
  };

  // Recent users columns for table
  const recentUsersColumns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar src={record.profilePicture} icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString(),
    },
  ];

  if (isError) return <div>Error loading user data</div>;

  return (
    <div className="admin-dashboard">
      <Title level={2}>Admin Dashboard</Title>
      <Text type="secondary">User management overview and statistics</Text>
      
      <Divider />
      
      {/* Statistics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={userStats.totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Administrators"
              value={userStats.adminCount}
              valueStyle={{ color: '#cf1322' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Today"
              value={userStats.activeToday}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="New This Week"
              value={userStats.newThisWeek}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Users Table */}
      <Card 
        title="Recent Users" 
        loading={isLoading}
        extra={<Text>Showing {Math.min(users.length, 5)} of {users.length} users</Text>}
      >
        <Table
          columns={recentUsersColumns}
          dataSource={[...users]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
          }          
          rowKey="_id"
          pagination={false}
        />
      </Card>

      {/* User Role Distribution */}
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="User Role Distribution">
            <Row>
              {/* <Col  xs={24} md={12}>
                <PieChart 
                style={{width:'100px', height: '100px'}}
                  data={[
                    { name: 'Admins', value: userStats.adminCount },
                    { name: 'Users', value: userStats.totalUsers - userStats.adminCount },
                  ]}
                  colors={['#ff4d4f', '#1890ff']}
                />
              </Col> */}
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ padding: '20px' }}>
                  <Statistic
                    title="Percentage of Admins"
                    value={(userStats.adminCount / userStats.totalUsers * 100).toFixed(1)}
                    suffix="%"
                  />
                  <Progress
                    percent={(userStats.adminCount / userStats.totalUsers * 100)}
                    strokeColor="#ff4d4f"
                    showInfo={false}
                  />
                  <Text type="secondary">
                    {userStats.adminCount} admin users out of {userStats.totalUsers} total users
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// Simple PieChart component - you might want to use a proper chart library
const PieChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div style={{ position: 'relative', height: '200px', width: '100%' }}>
      {data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const dashArray = `${percent} ${100 - percent}`;
        
        return (
          <div key={index} style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={colors[index]}
                strokeWidth="10"
                strokeDasharray={dashArray}
                strokeDashoffset={index === 0 ? 0 : 
                  data.slice(0, index).reduce((sum, i) => sum + (i.value / total) * 100, 0)
                }
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <Text strong>{total}</Text>
              <br />
              <Text type="secondary">Total</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;