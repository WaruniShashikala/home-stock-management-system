import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Progress,
  Tag,
  DatePicker,
  Select,
  Spin,
  Table,
  Alert,
  Button
} from 'antd';
import {
  DollarOutlined,
  PieChartOutlined,
  BarChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FundOutlined,
  CalendarOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useGetAllBudgetsQuery } from '../services/budgetManagementApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const { Title: AntTitle, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const BudgetDashboard = () => {
  const dashboardRef = useRef();
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch budget data
  const { data: budgets = [], isLoading, isError } = useGetAllBudgetsQuery();
  
  // Filter budgets based on date range and filters
  const filteredBudgets = budgets.filter(budget => {
    const startDate = moment(budget.startDate);
    const endDate = moment(budget.endDate);
    const dateMatch = startDate.isSameOrBefore(dateRange[1]) && endDate.isSameOrAfter(dateRange[0]);
    const categoryMatch = categoryFilter === 'all' || budget.category === categoryFilter;
    
    // Calculate budget status
    const spentPercentage = (budget.spentAmount / budget.totalAmount) * 100;
    let budgetStatus = '';
    if (spentPercentage >= 100) budgetStatus = 'over';
    else if (spentPercentage >= 80) budgetStatus = 'near';
    else budgetStatus = 'on-track';
    
    const statusMatch = statusFilter === 'all' || budgetStatus === statusFilter;
    
    return dateMatch && categoryMatch && statusMatch;
  });

  // Calculate dashboard statistics
  const calculateStats = () => {
    const stats = {
      totalBudgets: filteredBudgets.length,
      totalAllocated: 0,
      totalSpent: 0,
      remainingBalance: 0,
      nearDepletion: 0,
      overBudget: 0,
      onTrack: 0,
      upcoming: 0,
      categoryDistribution: {},
      paymentMethodDistribution: {}
    };

    filteredBudgets.forEach(budget => {
      stats.totalAllocated += budget.totalAmount;
      stats.totalSpent += budget.spentAmount || 0;
      
      // Calculate status counts
      const spentPercentage = (budget.spentAmount / budget.totalAmount) * 100;
      if (spentPercentage >= 100) stats.overBudget++;
      else if (spentPercentage >= 80) stats.nearDepletion++;
      else stats.onTrack++;
      
      // Count upcoming budgets
      if (moment(budget.startDate).isAfter(moment())) stats.upcoming++;
      
      // Category distribution
      stats.categoryDistribution[budget.category] = (stats.categoryDistribution[budget.category] || 0) + budget.totalAmount;
      
      // Payment method distribution
      if (budget.paymentMethod) {
        stats.paymentMethodDistribution[budget.paymentMethod] = 
          (stats.paymentMethodDistribution[budget.paymentMethod] || 0) + budget.totalAmount;
      }
    });

    stats.remainingBalance = stats.totalAllocated - stats.totalSpent;
    stats.utilizationRate = (stats.totalSpent / stats.totalAllocated) * 100;
    
    return stats;
  };

  const stats = calculateStats();

  // Prepare chart data
  const prepareChartData = () => {
    // Category distribution pie chart
    const categoryData = {
      labels: Object.keys(stats.categoryDistribution),
      datasets: [{
        data: Object.values(stats.categoryDistribution),
        backgroundColor: [
          '#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d',
          '#722ed1', '#eb2f96', '#fa8c16', '#a0d911', '#08979c'
        ]
      }]
    };

    // Status distribution bar chart
    const statusData = {
      labels: ['Budget Status'],
      datasets: [
        {
          label: 'On Track',
          data: [stats.onTrack],
          backgroundColor: '#52c41a'
        },
        {
          label: 'Near Limit',
          data: [stats.nearDepletion],
          backgroundColor: '#faad14'
        },
        {
          label: 'Over Budget',
          data: [stats.overBudget],
          backgroundColor: '#f5222d'
        }
      ]
    };

    return { categoryData, statusData };
  };

  const { categoryData, statusData } = prepareChartData();

  // Top budgets table data
  const topBudgets = [...filteredBudgets]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5)
    .map(budget => ({
      key: budget._id,
      name: budget.budgetName,
      category: budget.category,
      total: budget.totalAmount,
      spent: budget.spentAmount || 0,
      remaining: budget.totalAmount - (budget.spentAmount || 0),
      utilization: ((budget.spentAmount || 0) / budget.totalAmount) * 100
    }));

  const handleDownloadPDF = () => {
    const input = dashboardRef.current;
    
    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`budget_report_${moment().format('YYYYMMDD')}.pdf`);
    });
  };

  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  if (isError) return <Alert message="Error loading budget data" type="error" showIcon />;

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AntTitle level={2}>Budget Dashboard</AntTitle>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#825af2', borderColor: '#825af2' }}
        >
          Export Report
        </Button>
      </div>
      
      <Divider />
      
      {/* Filters Section */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {/* <Col xs={24} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              ranges={{
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
              }}
            />
          </Col> */}
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
            >
              <Option value="all">All Categories</Option>
              {[...new Set(budgets.map(b => b.category))].filter(Boolean).map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="all">All Statuses</Option>
              <Option value="on-track">On Track</Option>
              <Option value="near">Near Limit</Option>
              <Option value="over">Over Budget</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      
      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Budgets"
              value={stats.totalBudgets}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Allocated"
              value={stats.totalAllocated}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="Rs."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="Rs."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Remaining Balance"
              value={stats.remainingBalance}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="Rs."
            />
          </Card>
        </Col>
      </Row>
      
      {/* Budget Utilization */}
      <Card style={{ marginBottom: 24 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>Budget Utilization</AntTitle>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Progress
              type="dashboard"
              percent={Math.round(stats.utilizationRate)}
              strokeColor={
                stats.utilizationRate > 90 ? '#f5222d' :
                stats.utilizationRate > 75 ? '#faad14' : '#52c41a'
              }
              format={() => (
                <>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Math.round(stats.utilizationRate)}%
                  </div>
                  <div style={{ fontSize: '14px'}}>Utilization Rate</div>
                </>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <Progress
              type="dashboard"
              percent={Math.round((stats.totalSpent / stats.totalAllocated) * 100)}
              strokeColor="#1890ff"
              format={() => (
                <>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Math.round((stats.totalSpent / stats.totalAllocated) * 100)}%
                  </div>
                  <div style={{ fontSize: '16px'}}>Spent vs Allocated</div>
                </>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <Progress
              type="dashboard"
              percent={Math.round((stats.remainingBalance / stats.totalAllocated) * 100)}
              strokeColor="#13c2c2"
              format={() => (
                <>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Math.round((stats.remainingBalance / stats.totalAllocated) * 100)}%
                  </div>
                  <div style={{ fontSize: '16px'}}>Remaining Funds</div>
                </>
              )}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4} style={{ marginBottom: 16 }}>Budget Allocation by Category</AntTitle>
            <div style={{ height: 300 }}>
              <Pie 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${context.label}: Rs.${value.toFixed(2)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4} style={{ marginBottom: 16 }}>Budget Status Overview</AntTitle>
            <div style={{ height: 300 }}>
              <Bar 
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Budget Alerts */}
      <Card style={{ marginTop: 24 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>Budget Alerts</AntTitle>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Alert
              message={`${stats.overBudget} Over Budget`}
              description="Budgets that have exceeded their allocated amounts"
              type="error"
              showIcon
              icon={<AlertOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message={`${stats.nearDepletion} Near Limit`}
              description="Budgets that have spent 80% or more of their allocation"
              type="warning"
              showIcon
              icon={<ClockCircleOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message={`${stats.upcoming} Upcoming`}
              description="Budgets that will start soon"
              type="info"
              showIcon
              icon={<CalendarOutlined />}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Top Budgets Table */}
      <Card style={{ marginTop: 24 }}>
        <AntTitle level={4} style={{ marginBottom: 16 }}>Top 5 Budgets by Amount</AntTitle>
        <Table
          columns={[
            { title: 'Budget Name', dataIndex: 'name', key: 'name' },
            { title: 'Category', dataIndex: 'category', key: 'category' },
            { 
              title: 'Total (Rs.)', 
              dataIndex: 'total', 
              key: 'total',
              render: value => value.toFixed(2)
            },
            { 
              title: 'Spent (Rs.)', 
              dataIndex: 'spent', 
              key: 'spent',
              render: value => value.toFixed(2)
            },
            { 
              title: 'Remaining (Rs.)', 
              dataIndex: 'remaining', 
              key: 'remaining',
              render: value => value.toFixed(2)
            },
            {
              title: 'Utilization',
              dataIndex: 'utilization',
              key: 'utilization',
              render: percent => (
                <Progress 
                  percent={Math.round(percent)} 
                  status={
                    percent >= 100 ? 'exception' : 
                    percent >= 80 ? 'active' : 'normal'
                  }
                  strokeColor={
                    percent >= 100 ? '#f5222d' :
                    percent >= 80 ? '#faad14' : '#52c41a'
                  }
                  format={percent => `${Math.round(percent)}%`}
                  size="small"
                />
              )
            }
          ]}
          dataSource={topBudgets}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default BudgetDashboard;