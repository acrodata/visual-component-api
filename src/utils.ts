import { GuiFields } from '@acrodata/gui';
import { isObject, isString, merge } from 'lodash-es';
import { VisualDataSource } from './interfaces';

/**
 * 合并数据源配置项
 * @param dataSource 组件数据源配置
 * @param config     组件接收到的数据源配置
 */
export function mergeDataSource(dataSource?: VisualDataSource, config?: VisualDataSource) {
  if (dataSource) {
    try {
      if (isString(dataSource.api?.headers)) {
        dataSource.api.headers = JSON.parse(dataSource.api.headers);
      }
      if (isString(dataSource.api?.body)) {
        dataSource.api.body = JSON.parse(dataSource.api.body);
      }
      if (isString(dataSource.api?.params)) {
        dataSource.api.params = JSON.parse(dataSource.api.params);
      }
      if (isString(dataSource.tingyunConfig)) {
        dataSource.tingyunConfig = JSON.parse(dataSource.tingyunConfig || '{}');
      }
    } catch (error) {
      console.error(error);
    }

    merge(dataSource, config);

    if (isObject(dataSource.api?.headers)) {
      dataSource.api.headers = JSON.stringify(dataSource.api.headers);
    }
    if (isObject(dataSource.api?.body)) {
      dataSource.api.body = JSON.stringify(dataSource.api.body);
    }
    if (isObject(dataSource.api?.params)) {
      dataSource.api.params = JSON.stringify(dataSource.api.params);
    }
    if (isObject(dataSource.tingyunConfig)) {
      dataSource.tingyunConfig = JSON.stringify(dataSource.tingyunConfig);
    }
  }
}


/**
 * 从 GUI 配置中获取默认配置项
 * @param config  GUI 配置
 * @param options 默认配置项
 * @returns
 */
export function getOptionsFromConfig(config: GuiFields, options: Record<string, any>) {
  for (const key of Object.keys(config)) {
    const fieldCfg = config[key];
    if (fieldCfg.default != null) {
      options[key] = fieldCfg.default;
    } else {
      if (fieldCfg.type === 'group' || fieldCfg.type === 'menu' || fieldCfg.type === 'menuItem') {
        options[key] = getOptionsFromConfig(fieldCfg.children as GuiFields, {});
      } else if (fieldCfg.type === 'tabs') {
        options[key] = [];
      } else {
        options[key] = null;
      }
    }
  }
  return options;
}
