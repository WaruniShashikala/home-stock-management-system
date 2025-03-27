import React, { useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button
} from 'antd';
import {
  PieChartOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardList from './dashboardList';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

const Dashboard = () => {
  const dashboardRef = useRef();

  // Pie Chart Data with specified colors
  const pieData = {
    labels: ['Fruits', 'Dairy', 'Vegetables', 'Meat', 'Other'],
    datasets: [
      {
        data: [33, 33, 15, 10, 9],
        backgroundColor: [
          '#b7cee8', 
          '#B8AFFF', 
          '#8EC3FF', 
          '#ededed', 
          '#f2c7ff'  
        ],
        hoverBackgroundColor: [
          '#b7cee8', 
          '#9E8AFF',
          '#6DA8FF', 
          '#ededed',
          '#f2c7ff' 
        ],
        borderWidth: 1
      }
    ]
  };

  // Pie Chart Options with always-visible labels
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      },
      datalabels: {
        formatter: (value, context) => {
          return `${context.chart.data.labels[context.dataIndex]}: ${value}%`;
        },
        color: '#444',
        font: {
          weight: 'bold'
        },
        anchor: 'center',
        align: 'center',
        clip: false
      }
    }
  };

  // Bar Chart Data
  const barData = {
    labels: ['2023-06', '2023-09', '2023-12', '2024-03', '2024-06', '2024-09', '2024-12', '2025-03'],
    datasets: [
      {
        label: 'Count',
        data: [1.2, 1.5, 1.3, 1.7, 1.5, 1.8, 1.6, 2.0],
        backgroundColor: '#8EC3FF',
        borderColor: '#6DA8FF',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Waste Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.5
        }
      }
    }
  };

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
      pdf.save('waste_report.pdf');
    });
  };

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AntTitle level={2}>Waste Reports</AntTitle>
        <Button 
          style={{backgroundColor:'#825af2'}}
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleDownloadPDF}
        >
          Download as PDF
        </Button>
      </div>
      
      <Divider />
      
      <AntTitle level={3}>
        <PieChartOutlined style={{ marginRight: 8 }} />
        Waste Analytics
      </AntTitle>
      
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle style={{color: '#656466'}} level={4}>Category Distribution</AntTitle>
            <div style={{ height: 380, width: '100%', position: 'relative' }}>
              <Pie 
                data={pieData} 
                options={pieOptions}
                plugins={[{
                  id: 'datalabels',
                  beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const width = chart.width;
                    const height = chart.height;
                    
                    ctx.restore();
                    ctx.font = '12px Arial';
                    ctx.textBaseline = 'middle';
                    
                    chart.data.datasets.forEach((dataset, i) => {
                      const meta = chart.getDatasetMeta(i);
                      meta.data.forEach((element, index) => {
                        const data = dataset.data[index];
                        const label = chart.data.labels[index];
                        const x = element.tooltipPosition().x;
                        const y = element.tooltipPosition().y;
                        
                        ctx.fillText(`${label}: ${data}%`, x, y);
                      });
                    });
                    
                    ctx.save();
                  }
                }]}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <DashboardList/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;