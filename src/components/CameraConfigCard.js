// CameraConfigCard.jsx
import React from 'react';

const CameraConfigCard = ({ camera, onUpdate, onDelete, onToggleRecording }) => {
  const handleNameChange = (e) => {
    onUpdate(camera.id, { name: e.target.value });
  };

  const handleUrlChange = (e) => {
    onUpdate(camera.id, { url: e.target.value });
  };

  return (
    <div className="camera-card">
      <div className="card-header">
        <input
          type="text"
          className="camera-name"
          value={camera.name}
          onChange={handleNameChange}
          placeholder="摄像头名称"
        />
        <button 
          className="delete-btn"
          onClick={() => onDelete(camera.id)}
        >
          删除
        </button>
      </div>
      
      <div className="card-body">
        <div className="form-group">
          <label>URL地址:</label>
          <input
            type="text"
            className="camera-url"
            value={camera.url}
            onChange={handleUrlChange}
            placeholder="rtsp:// 或 http:// 流地址"
          />
        </div>
        
        <button
          className={`record-btn ${camera.isRecording ? 'recording' : ''}`}
          onClick={() => onToggleRecording(camera.id)}
        >
          {camera.isRecording ? '停止记录' : '开始记录'}
        </button>
      </div>
    </div>
  );
};

export default CameraConfigCard;
