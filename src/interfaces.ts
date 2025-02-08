export interface VisualAttr {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  deg?: number;
  opacity?: number;
  flipH?: boolean;
  flipV?: boolean;
  translate?: number[];
}

export interface VisualEvent {
  description: string;
  fields?: {
    description: string;
  };
}

export interface VisualEvents {
  [k: string]: VisualEvent;
}

export interface VisualAction {
  description: string;
}

export interface VisualActions {
  [k: string]: VisualAction;
}

export interface VisualApiField {
  /** 字段描述 */
  description: string;
  /** 字段类型 */
  type?: string;
  /** 是否为可选字段 */
  optional?: boolean;
  /** 映射的字段 */
  mapping?: string;
}

export interface VisualApiFields {
  [k: string]: VisualApiField;
}

export interface VisualApi {
  /** 接口描述 */
  description: string;
  /** 请求函数 */
  handler: string;
  /** 字段列表 */
  fields?: VisualApiFields;
};

export interface VisualApis {
  [k: string]: VisualApi;
}

export interface VisualDataConfig {
  /** 从对象转数组之后带过来的 key，作用同 id */
  key: string;
  /** 标题 */
  name?: string;
  /** 同标题 */
  description: string;
  /** API 字段列表 */
  fields?: VisualApiFields;
  /** API 字段映射 */
  fieldsMapping?: Record<string, string>;
  /** 受控模式 */
  controlledMode: boolean;
  /** 是否自动更新请求 */
  autoUpdate: boolean;
  /** 定时间隔 */
  timeInterval: number;
  /** 数据源配置信息 */
  dataSource: VisualDataSource;
}

export interface VisualDataConfigs {
  [k: string]: VisualDataConfig;
}

export type VisualDataSourceType =
  | 'mock'
  | 'static'
  | 'api'
  | 'csv'
  | 'database'
  | 'tingyun'
  | 'prometheus'
  | 'apacheDruid';

export interface VisualDataFilter {
  /** 全局过滤器的 id */
  id?: number;
  /** 是否启用 */
  enable?: boolean;
  /** 数据处理函数的名称 */
  name: string;
  /** 数据处理函数主体，只有 return 部分 */
  content: string;
  /** 数据处理函数，function(data) { return data } */
  code?: string;
}

export interface VisualDataSource {
  type?: VisualDataSourceType;
  useFilter?: boolean; // 是否使用过滤器
  filters?: VisualDataFilter[];
  api?: string; // API 地址
  apiHeaders?: string; // 请求头
  apiBody?: any; // POST 请求体
  apiMethod?: 'get' | 'post'; // 请求方法
  apiParams?: any; // GET 请求参数
  local?: boolean;
  cookie?: boolean;
  csv?: number;
  database?: number;
  sql?: string;
  staticData?: string; // 静态数据源
  tingyun?: number;
  tyFilter?: string; // 编辑器所需字符串
  prometheus?: number;
  prometheusConfig?: {
    method: string;
    path: string;
    query: string;
    step: number;
  };
  apacheDruid?: number;
  apacheDruidConfig?: {
    query: string;
  };
  mockTemplate?: string;
  timePeriod?: number;
}
