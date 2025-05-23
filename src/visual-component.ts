import { GuiFields } from '@acrodata/gui';
import { ChangeDetectorRef, EventEmitter, inject } from '@angular/core';
import { defaults, isArray, isEmpty, isPlainObject } from 'lodash-es';
import {
  VisualActions,
  VisualApis,
  VisualAttr,
  VisualDataConfig,
  VisualDataSource,
  VisualEvents,
  VisualInteractions,
} from './interfaces';
import { getOptionsFromConfig, mergeDataSource, mergeObject } from './utils';

export class VisualComponent {
  constructor(configs?: Record<string, any>) {
    if (configs) {
      this.attr = { ...configs['attr'] };
      this.config = { ...configs['config'] };
      this.options = defaults(configs['options'], getOptionsFromConfig(this.config, {}));
      this.apis = { ...configs['apis'] };
      this.data = { ...configs['data'] };
      this.resources = { ...configs['resources'] };

      if (isEmpty(configs['apis'])) {
        this.events = { ...configs['events'] };
        this.actions = { ...configs['actions'], ...this.actions };
      } else {
        this.events = {
          requestSucceeded: {
            description: '当数据接口请求成功时',
          },
          requestFailed: {
            description: '当数据接口请求失败时',
          },
          ...configs['events'],
        };

        this.actions = {
          requestData: {
            description: '请求数据',
          },
          render: {
            description: '导入数据',
          },
          ...configs['actions'],
          ...this.actions,
        };
      }
    }
  }

  changeDetectorRef = inject(ChangeDetectorRef);

  /** 组件 ID */
  id = '';

  /** 版本号 */
  version = '';

  /** 基础属性 */
  attr: VisualAttr = { x: 0, y: 0 };

  /** 配置项的 GUI 定义 */
  config: GuiFields = {};

  /** 配置项 */
  options: Record<string, any> = {};

  /** 事件 */
  events: VisualEvents = {};

  /** 动作 */
  actions: VisualActions = {
    updateAttr: {
      description: '更新组件属性',
    },
    updateOptions: {
      description: '更新组件配置',
    },
    show: {
      description: '显示',
    },
    hide: {
      description: '隐藏',
    },
    toggleHide: {
      description: '切换显隐',
    },
  };

  /** 交互配置 */
  interactions: VisualInteractions = {};

  /** API 字段配置 */
  apis: VisualApis = {};

  /** 静态数据 */
  data: Record<string, any[]> = {};

  /** 数据源配置 */
  dataConfig: Record<string, VisualDataConfig> = {};

  /** 请求响应数据 */
  responseData: Record<string, any[]> = {};

  /** 资源路径 */
  resources: Record<string, any> = {};

  /** 控制隐藏的变量 */
  isHide?: boolean;

  /** 无数据标记，每个组件根据业务场景独立控制 */
  noData?: boolean;

  /** 父组件 */
  parent?: VisualComponent | null;

  /** 子组件 */
  children?: VisualComponent[] | null;

  /** 显示 */
  show() {
    this.isHide = false;
    this.detectChanges();
  }

  /** 隐藏 */
  hide() {
    this.isHide = true;
    this.detectChanges();
  }

  /** 切换显隐状态 */
  toggleHide() {
    this.isHide = !this.isHide;
    this.detectChanges();
  }

  /** 组件初始化钩子函数 */
  init(options?: Record<string, any>) {}

  /** 组件销毁钩子函数 */
  destroy() {}

  /**
   * 渲染数据
   * @param data
   * @param options
   */
  render(data: any, options?: Record<string, any>) {
    this.detectChanges();
  }

  /**
   * 组件配置更新钩子函数
   * @param newOptions
   */
  updateOptions(newOptions: Record<string, any>) {
    if (!isEmpty(newOptions) && this.options != newOptions) {
      mergeObject(this.options, newOptions);
    }
    if (!isEmpty(this.apis)) {
      this.render(this.responseData['source'], this.options);
    }
    this.detectChanges();
  }

  /**
   * 更新组件的基础属性
   * @param newAttr
   */
  updateAttr(newAttr: VisualAttr) {
    mergeObject(this.attr, newAttr);
    this.detectChanges();
  }

  /**
   * 组件缩放钩子函数
   * @param width
   * @param height
   */
  resize(width: number, height: number) {
    this.detectChanges();
  }

  /**
   * 请求数据接口
   * @param dataSource 数据源配置
   */
  request!: (dataSource?: VisualDataSource) => Promise<void>;

  /** 当数据接口请求成功时 */
  requestSucceeded = new EventEmitter<any>();

  /** 当数据接口请求失败时 */
  requestFailed = new EventEmitter<any>();

  /**
   * 请求数据
   * @param params 请求参数
   */
  requestData(params: Record<string, any> | any[]) {
    let dataSrc = {};
    let opts = {};
    if (isPlainObject(params)) {
      dataSrc = params;
    } else if (isArray(params)) {
      dataSrc = isPlainObject(params[0]) ? params[0] : {};
      opts = isPlainObject(params[1]) ? params[1] : {};
    }

    mergeDataSource(this.dataConfig['source']?.dataSource, dataSrc);
    mergeObject(this.options, opts);

    this.request(this.dataConfig['source']?.dataSource)
      .then(res => this.requestSucceeded.emit(res))
      .catch(err => this.requestFailed.emit(err));
  }

  /** 触发变更检测 */
  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  /** 标记变更检测 */
  markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
}
