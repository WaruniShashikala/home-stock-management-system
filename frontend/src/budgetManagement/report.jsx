import React, { useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Statistic,
  Spin,
  Alert,
  Tag
} from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  FundOutlined,
  DollarOutlined,
  AlertOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useGetAllBudgetsQuery } from '../services/budgetManagementApi';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

const Report = () => {
  const reportRef = useRef();
  const { data: budgets = [], isLoading, isError } = useGetAllBudgetsQuery();

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  if (isError) {
    return <Alert message="Error loading budgets" type="error" showIcon />;
  }

  // Calculate budget statistics
  const totalBudgets = budgets.length;
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0);
  const activeBudgets = budgets.filter(budget => 
    moment().isBetween(moment(budget.startDate), moment(budget.endDate))
  ).length;
  const endingSoon = budgets.filter(budget => 
    moment(budget.endDate).diff(moment(), 'days') <= 7
  ).length;

  // Budget status analysis
  const budgetStatus = {
    'On Track': budgets.filter(budget => {
      const spentPercentage = (budget.spentAmount || 0) / budget.totalAmount * 100;
      return spentPercentage < 80;
    }).length,
    'Near Limit': budgets.filter(budget => {
      const spentPercentage = (budget.spentAmount || 0) / budget.totalAmount * 100;
      return spentPercentage >= 80 && spentPercentage < 100;
    }).length,
    'Over Budget': budgets.filter(budget => {
      const spentPercentage = (budget.spentAmount || 0) / budget.totalAmount * 100;
      return spentPercentage >= 100;
    }).length
  };

  // Category distribution data
  const categoryDistribution = budgets.reduce((acc, budget) => {
    acc[budget.category] = (acc[budget.category] || 0) + budget.totalAmount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        data: Object.values(categoryDistribution),
        backgroundColor: [
          '#4e79a7', 
          '#f28e2b', 
          '#e15759', 
          '#76b7b2', 
          '#59a14f',
          '#edc948',
          '#b07aa1',
          '#ff9da7'
        ],
        borderWidth: 1
      }
    ]
  };

  // Spending trend data (example for last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => 
    moment().subtract(i, 'months').format('MMM YYYY')
  ).reverse();

  const spendingTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Allocated',
        data: months.map(() => Math.floor(Math.random() * 50000) + 20000),
        borderColor: '#4e79a7',
        backgroundColor: '#4e79a7',
        tension: 0.1
      },
      {
        label: 'Actual Spend',
        data: months.map(() => Math.floor(Math.random() * 50000) + 15000),
        borderColor: '#e15759',
        backgroundColor: '#e15759',
        tension: 0.1
      }
    ]
  };

  // Utilization by payment method
  const paymentMethodData = {
    labels: ['Bank Transfer', 'Credit Card', 'Cash', 'Mobile Payment'],
    datasets: [
      {
        label: 'Amount Spent',
        data: [35000, 28000, 12000, 8000],
        backgroundColor: [
          '#4e79a7',
          '#f28e2b',
          '#e15759',
          '#76b7b2'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  const handleDownloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('budget_report.pdf');
    });
  };

  return (
    <div style={{ padding: '24px' }} ref={reportRef}>
      <Row justify="space-between" align="middle">
        <AntTitle level={2}>Budget Report</AntTitle>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#5e3ea1' }}
        >
          Export as PDF
        </Button>
      </Row>

      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Generated on {moment().format('MMMM Do YYYY, h:mm:ss a')}
      </Text>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Budgets"
              value={totalBudgets}
              prefix={<FundOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Allocated"
              value={totalAllocated.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Budgets"
              value={activeBudgets}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <AntTitle level={3} style={{ marginTop: 24 }}>
        <PieChartOutlined /> Budget Allocation
      </AntTitle>

      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4}>By Category</AntTitle>
            <div style={{ height: '300px' }}>
              <Pie 
                data={pieData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const percentage = Math.round((value / totalAllocated) * 100);
                          return `${label}: $${value.toLocaleString()} (${percentage}%)`;
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
            <AntTitle level={4}>By Payment Method</AntTitle>
            <div style={{ height: '300px' }}>
              <Bar data={paymentMethodData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      <AntTitle level={3} style={{ marginTop: 24 }}>
        <LineChartOutlined /> Spending Trends
      </AntTitle>
      <Card style={{ marginTop: 16 }}>
        <div style={{ height: '300px' }}>
          <Line data={spendingTrendData} options={chartOptions} />
        </div>
      </Card>

      <AntTitle level={3} style={{ marginTop: 24 }}>
        <BarChartOutlined /> Budget Status Overview
      </AntTitle>
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ height: '300px' }}>
              <Bar 
                data={{
                  labels: Object.keys(budgetStatus),
                  datasets: [{
                    label: 'Number of Budgets',
                    data: Object.values(budgetStatus),
                    backgroundColor: [
                      '#59a14f',
                      '#f28e2b',
                      '#e15759'
                    ],
                    borderWidth: 1
                  }]
                }} 
                options={chartOptions}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Budget Alerts">
            {budgetStatus['Over Budget'] > 0 && (
              <div style={{ marginBottom: 12 }}>
                <Tag icon={<AlertOutlined />} color="error">
                  {budgetStatus['Over Budget']} budget(s) exceeded limits
                </Tag>
              </div>
            )}
            {budgetStatus['Near Limit'] > 0 && (
              <div style={{ marginBottom: 12 }}>
                <Tag icon={<AlertOutlined />} color="warning">
                  {budgetStatus['Near Limit']} budget(s) nearing limits
                </Tag>
              </div>
            )}
            {endingSoon > 0 && (
              <div style={{ marginBottom: 12 }}>
                <Tag icon={<AlertOutlined />} color="processing">
                  {endingSoon} budget(s) ending this week
                </Tag>
              </div>
            )}
            <div>
              <Tag icon={<CheckCircleOutlined />} color="success">
                {budgetStatus['On Track']} budget(s) on track
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Report;