import { isString, isObject, merge } from 'lodash-es';
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
