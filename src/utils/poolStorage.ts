import type { PoolType, PoolConfig } from "@/types/card";

const POOL_STORAGE_KEY = 'gacha_pool_configs';

export class PoolStorage {
  // 保存卡池配置到本地存储
  static savePoolConfig(poolType: PoolType, config: PoolConfig) {
    try {
      const allConfigs = this.getAllConfigs();
      allConfigs[poolType] = config;
      localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(allConfigs));
    } catch (error) {
      console.error('Failed to save pool config:', error);
    }
  }

  // 加载所有卡池配置
  static getAllConfigs(): Record<PoolType, PoolConfig> {
    try {
      const stored = localStorage.getItem(POOL_STORAGE_KEY);
      return JSON.parse(stored || '{}');
    } catch (error) {
      console.error('Failed to load pool configs:', error);
      return JSON.parse('{}');
    }
  }

  // 加载单个卡池配置
  static getPoolConfig(poolType: PoolType): PoolConfig | null {
    try {
      const allConfigs = this.getAllConfigs();
      return allConfigs[poolType] || null;
    } catch (error) {
      console.error('Failed to load pool config:', error);
      return null;
    }
  }

  // 导出卡池配置为JSON
  static exportAsJson(poolType?: PoolType): string {
    try {
      const allConfigs = this.getAllConfigs();
      const data = poolType ? { [poolType]: allConfigs[poolType] } : allConfigs;
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export pool config:', error);
      return '';
    }
  }

  // 从JSON导入卡池配置
  static importFromJson(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      const allConfigs = this.getAllConfigs();

      for (const [poolType, config] of Object.entries(data)) {
        if (['normal', 'event_sp', 'event_ssr', 'event_ur'].includes(poolType)) {
          allConfigs[poolType as PoolType] = config as PoolConfig;
        }
      }

      localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(allConfigs));
      return { success: true, message: '导入成功' };
    } catch (error) {
      console.error('Failed to import pool config:', error);
      return { success: false, message: '导入失败：数据格式错误' };
    }
  }

  // 清空卡池配置
  static clearAllConfigs() {
    try {
      localStorage.removeItem(POOL_STORAGE_KEY);
      return { success: true, message: '已清空所有配置' };
    } catch (error) {
      console.error('Failed to clear pool configs:', error);
      return { success: false, message: '清空失败' };
    }
  }
}