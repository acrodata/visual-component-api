export interface VisualAttr {
  left: number;
  top: number;
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

export interface VisualInteraction {
  /** 交互事件 */
  event: string;
  /** 交互组件 */
  component: { id: string; name: string };
  /** 交互动作 */
  action: string;
  /** 数据过滤器 */
  filters: VisualDataFilter[];
  /** 条件配置 */
  conditions?: VisualDataFilter[];
  /** 条件类型：全部满足或者只满足一个 */
  conditionType?: 'all' | 'either' | null;
}

export interface VisualInteractions {
  [k: string]: VisualInteraction[];
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
}

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
  | VisualDatabaseType
  | VisualDataSourceOtherType;

export type VisualDatabaseType =
  | 'mysql'
  | 'oracle'
  | 'db2'
  | 'sqlserver'
  | 'postgresql'
  | 'dm'
  | 'clickhouse';

export type VisualDataSourceOtherType = 'prometheus' | 'apacheDruid' | 'tingyun';

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
  /** 是否使用过滤器 */
  useFilter?: boolean;
  /** 过滤器数组 */
  filters?: VisualDataFilter[];
  /** Mock 数据模板 */
  mockTemplate?: string;
  /** 时间戳 */
  timePeriod?: number;
  /** 静态数据源 */
  staticData?: string;
  /** API 数据源配置 */
  api?: {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    headers?: any;
    body?: any;
    params?: any;
    proxy?: boolean;
    cookie?: boolean;
  };
  /** 数据源 ID */
  csv?: string | number;
  /** 数据库的数据源 ID */
  database?: string | number;
  /** 数据库查询 sql */
  sql?: string;
  /** 数据源 ID */
  prometheus?: string | number;
  /** 数据源配置 */
  prometheusConfig?: {
    method: string;
    path: string;
    query: string;
    step: number;
  };
  /** 数据源 ID */
  apacheDruid?: string | number;
  /** 数据源配置 */
  apacheDruidConfig?: {
    query: string;
  };
  /** 数据源 ID */
  tingyun?: string | number;
  /** 数据源配置 */
  tingyunConfig?: string;
}
