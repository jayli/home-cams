// recorderManager.js
const fs = require('fs');
const path = require('path');
const Recorder = require('rtsp-downloader').Recorder
const configPath = require('./configPath').configPath;

module.exports = {
  recs: {}, // 存储Recorder实例, key 是 camName

  getRecorder: function(name) {
    if (this.recs[name]) {
      return this.recs[name];
    } else {
      return null;
    }
  },

  delRecorder: function(name) {
    if (this.recs[name]) {
      this.recs[name].stopRecording();
      delete this.recs[name];
    }
  },

  addRecoder: function(name, rec) {
    this.recs[name] = rec;
  },

  stopRecorder: function(name) {
    var rec = this.getRecorder(name);
    if (rec !== null) {
      rec.stopRecording();
    }
  },

  isRecording: function(name) {
    var rec = this.getRecorder(name);
    if (rec === null) {
      return false;
    } else {
      return rec.isRecoding();
    }
  },

  startRecorder: function(name, camUrl) {
    const configFileData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFileData);
    const folder = path.join(config.globalConfig.savePath, '/videos/');
    const timeLimit = config.globalConfig.segmentDuration;

    this.delRecorder(name);
    const rec = new Recorder({
      url: camUrl,
      timeLimit:timeLimit,
      folder: folder,
      name: name,
      folderSizeLimit: 510
    });
    rec.startRecording();
    this.addRecoder(name, rec);
    return rec;
  },

  // 根据 configPath 配置文件来重置所有的 Recorder
  // 主要是考虑进程中断后重新启动时，根据配置文件记录的摄像头列表和是否正在录制的状态
  // 来重新启动 Recorder
  updateAll: function() {
    const configFileData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFileData);
    const cameras = config.cameras;

    cameras.forEach(camera => {
      const isRecordingInConfig = camera.isRecording;
      const isCurrentlyRecording = this.isRecording(camera.name);

      // 如果配置中显示应该录制但当前没有录制，则启动录制
      if (isRecordingInConfig && !isCurrentlyRecording) {
        this.startRecorder(camera.name, camera.url);
      }
      // 如果配置中显示不应该录制且当前正在录制，则停止录制
      else if (!isRecordingInConfig && isCurrentlyRecording) {
        this.stopRecorder(camera.name);
      }
      // 如果配置中显示应该录制且当前正在录制，则跳过
      // 如果配置中显示不应该录制且当前没有录制，则跳过
    });
  }

};
