// CameraManager.js
import React, { useState, useEffect } from 'react';
import CameraConfigCard from './CameraConfigCard';
import GlobalConfig from './GlobalConfig';

const CameraManager = () => {
  const [cameras, setCameras] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({
    savePath: '~/ttt/a/',
    segmentDuration: 15
  });

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/load_config');
        if (response.ok) {
          const config = await response.json();
          setCameras(config.cameras || []);
          setGlobalConfig(config.globalConfig || globalConfig);
        } else {
          // If server returns error, try to initialize default configuration
          saveConfig();
        }
      } catch (error) {
        console.error('Failed to load config from server:', error);
        alert('无法从服务器加载配置，请检查网络连接或稍后再试。');
      }
    };

    loadConfig();
  }, []);

  // 保存配置
  const saveConfig = async (newCameras = cameras, newGlobalConfig = globalConfig) => {
    try {
      const config = {
        cameras: newCameras,
        globalConfig: newGlobalConfig
      };
      
      const response = await fetch('/save_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to save config to server:', error);
      alert('无法保存配置到服务器，请检查网络连接或稍后再试。');
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
