// GlobalConfig.jsx
import React from 'react';

const GlobalConfig = ({ config, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="global-config">
      <h3>全局配置</h3>
      <div className="config-item">
        <label htmlFor="savePath">存储路径:</label>
        <input
          type="text"
          id="savePath"
          value={config.savePath}
          onChange={(e) => handleChange('savePath', e.target.value)}
        />
      </div>
      <div className="config-item">
        <label htmlFor="segmentDuration">片段时长(分):</label>
        <input
          type="number"
          id="segmentDuration"
          value={config.segmentDuration}
          onChange={(e) => handleChange('segmentDuration', parseInt(e.target.value) || 15)}
        />
      </div>
    </div>
  );
};

export default GlobalConfig;
