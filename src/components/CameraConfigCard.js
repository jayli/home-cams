// CameraConfigCard.js
import React from 'react';

const CameraConfigCard = ({ camera, onUpdate, onDelete, onToggleRecording }) => {
  const handleNameChange = (e) => {
    onUpdate(camera.id, { name: e.target.value });
  };

  const handleUrlChange = (e) => {
    onUpdate(camera.id, { url: e.target.value });
  };

  const handleDeleteClick = () => {
    // 检查摄像头是否正在录制
    if (camera.isRecording) {
      alert('无法删除正在录制的摄像头，请先停止录制');
      return;
    }
    
    if (window.confirm('确定要删除这个摄像头吗？')) {
      onDelete(camera.id);
    }
  };

  // 修改记录按钮的点击处理函数
  const handleToggleRecording = async () => {
    await onToggleRecording(camera.id);
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
          disabled={camera.isRecording}
        />
        <button 
          className="delete-btn"
          onClick={handleDeleteClick}
        >
          ×
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
            // 当摄像头正在记录时禁用URL输入框
            disabled={camera.isRecording}
          />
        </div>
        <div className="button-group">
          <button
            className={`record-btn ${camera.isRecording ? 'recording' : ''}`}
            onClick={handleToggleRecording}
          >
            {camera.isRecording ? '停止记录' : '开始记录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraConfigCard;
