import { useState } from 'react';
import { 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Alert, 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Login values:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (values.username === 'demo' && values.password === 'demo123') {
        onLogin();
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={3} className="login-title">Welcome Back</Title>
          <Text className="login-subtitle">Sign in to manage your home inventory</Text>
        </div>
        
        <div className="login-body">
          {error && (
            <Alert 
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 4, message: 'Username must be at least 4 characters' }
              ]}
              className="login-form-item"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              className="login-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }} className="login-form-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/forgot-password" className="login-form-forgot">
                  <Text>Forgot password?</Text>
                </Link>
              </div>
            </Form.Item>

            <Form.Item className="login-form-item">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-form-button"
                loading={loading}
                disabled={loading}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            Don't have an account?{' '}
            <Link to="/signup">
              <Text strong>Sign up</Text>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;