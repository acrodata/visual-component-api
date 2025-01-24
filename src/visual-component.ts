import { GuiFields } from '@acrodata/gui';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { assign, isEmpty, merge } from 'lodash-es';
import {
  VisualComponentActions,
  VisualComponentApis,
  VisualComponentAttr,
  VisualComponentDataConfig,
  VisualComponentDataSource,
  VisualComponentEvents,
} from './interfaces';
import { mergeDataSource } from './utils';

export class VisualComponent {
  constructor(configs?: Record<string, any>, cdr?: ChangeDetectorRef) {
    if (configs) {
      configs['version'] && (this.version = configs['version']);
      !isEmpty(configs['attr']) && (this.attr = assign(configs['attr'], this.attr));
      !isEmpty(configs['config']) && (this.config = assign(configs['config'], this.config));
      !isEmpty(configs['options']) && (this.options = assign(configs['options'], this.options));
      !isEmpty(configs['apis']) && (this.apis = assign(configs['apis'], this.apis));
      !isEmpty(configs['data']) && (this.data = assign(configs['data'], this.data));

      if (!isEmpty(configs['apis'])) {
        this.events = assign(
          {
            requestSucceeded: {
              description: '当数据接口请求成功时',
            },
            requestFailed: {
              description: '当数据接口请求失败时',
            },
          },
          configs['events'],
          this.events
        );

        this.actions = assign(
          {
            requestData: {
              description: '请求数据',
            },
            render: {
              description: '导入数据',
            },
          },
          configs['actions'],
          this.actions
        );
      } else {
        !isEmpty(configs['events']) && (this.events = assign(configs['events'], this.events));
        !isEmpty(configs['actions']) && (this.actions = assign(configs['actions'], this.actions));
      }
    }

    cdr && (this._cdr = cdr);
  }

  private _cdr?: ChangeDetectorRef;

  /** 组件当前数据 */
  private _data: any;

  /** 版本号 */
  version = "0.0.0"

  /** 基础属性 */
  attr: VisualComponentAttr = {};

  /** 配置项的 GUI 定义 */
  config: GuiFields = {};

  /** 配置项 */
  options: Record<string, any> = {};

  /** 事件 */
  events: VisualComponentEvents = {};

  /** 动作 */
  actions: VisualComponentActions = {
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

  /** API 字段配置 */
  apis: VisualComponentApis = {};

  /** 静态数据 */
  data: Record<string, any[]> = {};

  /** 数据源配置 */
  dataConfig: Record<string, VisualComponentDataConfig> = {};

  /** 请求响应数据 */
  responseData: Record<string, any[]> = {};

  /** 资源路径 */
  resources: Record<string, any> = {};

  /** 控制隐藏的变量 */
  isHide = false;

  /** 无数据标记，每个组件根据业务场景独立控制 */
  noData = false;

  /** 显示 */
  show() {
    this.isHide = false;
    this._cdr && this._cdr.detectChanges();
  }

  /** 隐藏 */
  hide() {
    this.isHide = true;
    this._cdr && this._cdr.detectChanges();
  }

  /** 切换显隐状态 */
  toggleHide() {
    this.isHide = !this.isHide;
    this._cdr && this._cdr.detectChanges();
  }

  /** 组件初始化钩子函数 */
  init(options?: Record<string, any>) { }

  /** 组件销毁钩子函数 */
  destroy() { }

  /**
   * 渲染数据
   * @param data
   * @param options
   */
  render(data: any, options?: Record<string, any>) {
    this._cdr && this._cdr.detectChanges();
  }

  /**
   * 组件配置更新钩子函数
   * @param newOptions
   */
  updateOptions(newOptions: Record<string, any>) {
    this._cdr && this._cdr.detectChanges();
  }

  /**
   * 更新组件的基础属性
   * @param newAttr
   */
  updateAttr(newAttr: VisualComponentAttr) {
    merge(this.attr, newAttr);
    this._cdr && this._cdr.detectChanges();
  }

  /**
   * 组件缩放钩子函数
   * @param width
   * @param height
   */
  resize(width: number, height: number) {
    this._cdr && this._cdr.detectChanges();
  }

  /**
   * 请求数据接口
   * @param dataSource 数据源配置
   */
  request!: (dataSource?: VisualComponentDataSource) => Promise<void>;

  /** 当数据接口请求成功时 */
  requestSucceeded = new EventEmitter<any>();

  /** 当数据接口请求失败时 */
  requestFailed = new EventEmitter<any>();

  /**
   * 请求数据
   * @param data
   * @description  config 数据源配置; options 组件配置项
   */
  requestData(data: { config?: any; options?: any }) {
    mergeDataSource(this.dataConfig?.['source']?.dataSource, data.config || {});
    merge(this.options, data.options || {});
    this.request(this.dataConfig['source'].dataSource)
      .then(res => this.requestSucceeded.emit(res))
      .catch(err => this.requestFailed.emit(err));
  }

  // TODO: 多数据源支持
  /**
   * 设置当前数据
   * @param data 传入的数据
   */
  setData(data: any[]) {
    if (data && this._data !== data) {
      this._data = data;
    }
    return this._data;
  }

  /**
   * 设置当前配置
   * @param options 传入的配置
   */
  setOptions(options: Record<string, any>) {
    if (options && this.options !== options) {
      merge(this.options, options);
    }
    return this.options;
  }
}
