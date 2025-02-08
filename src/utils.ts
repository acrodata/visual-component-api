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
      if (isString(dataSource.apiHeaders)) {
        dataSource.apiHeaders = JSON.parse(dataSource.apiHeaders);
      }
      if (isString(dataSource.apiBody)) {
        dataSource.apiBody = JSON.parse(dataSource.apiBody);
      }
      if (isString(dataSource.apiParams)) {
        dataSource.apiParams = JSON.parse(dataSource.apiParams);
      }
      if (isString(dataSource.tyFilter)) {
        dataSource.tyFilter = JSON.parse(dataSource.tyFilter || '{}');
      }
    } catch (error) {
      console.error(error);
    }

    merge(dataSource, config);

    if (isObject(dataSource.apiHeaders)) {
      dataSource.apiHeaders = JSON.stringify(dataSource.apiHeaders);
    }
    if (isObject(dataSource.apiBody)) {
      dataSource.apiBody = JSON.stringify(dataSource.apiBody);
    }
    if (isObject(dataSource.apiParams)) {
      dataSource.apiParams = JSON.stringify(dataSource.apiParams);
    }
    if (isObject(dataSource.tyFilter)) {
      dataSource.tyFilter = JSON.stringify(dataSource.tyFilter);
    }
  }
}
