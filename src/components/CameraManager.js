// CameraManager.jsx
import React, { useState, useEffect } from 'react';
import CameraConfigCard from './CameraConfigCard';
import GlobalConfig from './GlobalConfig';

const CameraManager = () => {
  const [cameras, setCameras] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({
    storageFile: '~/.home-cam-recordings',
    segmentDuration: 15
  });

  // 加载配置
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedData = localStorage.getItem('home-cam-config');
        if (savedData) {
          const config = JSON.parse(savedData);
          setCameras(config.cameras || []);
          setGlobalConfig(config.globalConfig || globalConfig);
        } else {
          // 初始化默认配置
          saveConfig();
        }
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };

    loadConfig();
  }, []);

  // 保存配置
  const saveConfig = (newCameras = cameras, newGlobalConfig = globalConfig) => {
    try {
      const config = {
        cameras: newCameras,
        globalConfig: newGlobalConfig
      };
      localStorage.setItem('home-cam-config', JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  // 添加摄像头
  const addCamera = () => {
    const newCamera = {
      id: Date.now(),
      name: `Camera ${cameras.length + 1}`,
      url: '',
      isRecording: false
    };
    const newCameras = [...cameras, newCamera];
    setCameras(newCameras);
    saveConfig(newCameras);
  };

  // 更新摄像头配置
  const updateCamera = (id, updates) => {
    const newCameras = cameras.map(camera => 
      camera.id === id ? { ...camera, ...updates } : camera
    );
    setCameras(newCameras);
    saveConfig(newCameras);
  };

  // 删除摄像头
  const deleteCamera = (id) => {
    const newCameras = cameras.filter(camera => camera.id !== id);
    setCameras(newCameras);
    saveConfig(newCameras);
  };

  // 更新全局配置
  const updateGlobalConfig = (newConfig) => {
    setGlobalConfig(newConfig);
    saveConfig(cameras, newConfig);
  };

  // 切换录制状态
  const toggleRecording = (id) => {
    const newCameras = cameras.map(camera => 
      camera.id === id ? { ...camera, isRecording: !camera.isRecording } : camera
    );
    setCameras(newCameras);
    saveConfig(newCameras);
  };

  return (
    <div className="camera-manager">
      <h1>摄像头管理系统</h1>
      
      <GlobalConfig 
        config={globalConfig}
        onUpdate={updateGlobalConfig}
      />
      
      <div className="cameras-header">
        <h2>摄像头配置</h2>
        <button onClick={addCamera} className="add-camera-btn">
          添加摄像头
        </button>
      </div>
      
      <div className="cameras-grid">
        {cameras.map(camera => (
          <CameraConfigCard
            key={camera.id}
            camera={camera}
            onUpdate={updateCamera}
            onDelete={deleteCamera}
            onToggleRecording={toggleRecording}
          />
        ))}
      </div>
    </div>
  );
};

export default CameraManager;
