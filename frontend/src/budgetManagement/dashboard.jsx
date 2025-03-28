import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Progress,
  Tag
} from 'antd';
import {
  DollarOutlined,
  PieChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FundOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import BudgetChart from './BudgetChart';

const { Title } = Typography;

export default function Dashboard() {
  // Mock data - replace with your actual data source
  const budgetStats = {
    totalBudgets: 15,
    totalAllocated: 125000,
    totalSpent: 87650,
    remainingBalance: 37350,
    nearDepletion: 4,
    upcomingBudgets: 3
  };

  const categoryDistribution = [
    { name: 'Operations', value: 45 },
    { name: 'Marketing', value: 20 },
    { name: 'R&D', value: 15 },
    { name: 'HR', value: 12 },
    { name: 'Other', value: 8 }
  ];

  const budgetStatus = [
    { type: 'On Track', value: 60 },
    { type: 'Near Limit', value: 25 },
    { type: 'Over Budget', value: 15 }
  ];

  const spendingTrends = [
    { month: 'Jan', allocated: 20000, spent: 18000 },
    { month: 'Feb', allocated: 20000, spent: 19500 },
    { month: 'Mar', allocated: 20000, spent: 22000 },
    { month: 'Apr', allocated: 20000, spent: 17500 },
    { month: 'May', allocated: 20000, spent: 16000 },
    { month: 'Jun', allocated: 25000, spent: 21000 }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Budget Dashboard</Title>
      <Divider />
      
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Active Budgets"
              value={budgetStats.totalBudgets}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Total Allocated"
              value={budgetStats.totalAllocated}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={budgetStats.totalSpent}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Remaining Balance"
              value={budgetStats.remainingBalance}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* Budget Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Budget Utilization">
            <Row gutter={16}>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={70}
                  strokeColor="#52c41a"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>70%</div>
                      <div>Utilization Rate</div>
                    </>
                  )}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={Math.round((budgetStats.totalSpent / budgetStats.totalAllocated) * 100)}
                  status="active"
                  format={(percent) => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {percent}%
                      </div>
                      <div>Spent vs Allocated</div>
                    </>
                  )}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={Math.round((budgetStats.remainingBalance / budgetStats.totalAllocated) * 100)}
                  status="normal"
                  strokeColor="#13c2c2"
                  format={(percent) => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {percent}%
                      </div>
                      <div>Remaining Funds</div>
                    </>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Budget Allocation by Category">
            <BudgetChart 
              data={categoryDistribution} 
              type="pie" 
              colors={['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d']}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Monthly Spending Trends">
            <BudgetChart 
              data={spendingTrends} 
              type="line" 
              colors={['#1890ff', '#f5222d']}
              keys={['allocated', 'spent']}
            />
          </Card>
        </Col>
      </Row>

      {/* Budget Status and Alerts */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="Budget Status Overview">
            <BudgetChart 
              data={budgetStatus} 
              type="bar" 
              colors={['#52c41a', '#faad14', '#f5222d']}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Budget Alerts">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <AlertOutlined style={{ color: '#f5222d', marginRight: '8px' }} />
              <span>2 budgets have exceeded their limits</span>
              <Tag color="red" style={{ marginLeft: '8px' }}>Over Budget</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <ClockCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              <span>4 budgets are nearing their limits (80%+ spent)</span>
              <Tag color="orange" style={{ marginLeft: '8px' }}>Warning</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <CalendarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              <span>3 budgets will start in the next 7 days</span>
              <Tag color="blue" style={{ marginLeft: '8px' }}>Upcoming</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <span>9 budgets are within expected spending</span>
              <Tag color="green" style={{ marginLeft: '8px' }}>On Track</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}