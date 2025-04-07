// components/ImageUploader.js
import { Upload, message, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const ImageUploader = ({ value, onChange, disabled }) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const handleUpload = async ({ file }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwqizp90f/image/upload',
        formData
      );
      onChange(response.data.secure_url);
      message.success('Image uploaded successfully!');
    } catch (error) {
      message.error('Upload failed!');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={handleUpload}
      disabled={disabled || loading}
    >
      {value ? (
        <img
          src={value}
          alt="avatar"
          style={{ width: '100%', borderRadius: '50%' }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default ImageUploader;