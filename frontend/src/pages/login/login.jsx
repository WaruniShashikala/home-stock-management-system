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
import { useLoginMutation } from '../../services/authApi';
import { setCredentials } from '../../slice/authSlice';
import { useDispatch } from 'react-redux';
import './login.css';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.data?.error || 'Login failed. Please try again.');
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
              name="email" // Changed from username to email to match backend
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              className="login-form-item"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Email" 
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
                loading={isLoading}
                disabled={isLoading}
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