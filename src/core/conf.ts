import { Util } from '../libs/util';
import { Color } from 'three/src/math/Color';

export class Conf {
  private static _instance: Conf;

  // #############################################
  // 本番フラグ
  // #############################################
  public IS_BUILD:boolean = false;

  // テスト用 パラメータ
  public FLG_PARAM: boolean          = this.IS_BUILD ? false : false;
  public FLG_LOW_FPS: boolean        = this.IS_BUILD ? false : false;
  public FLG_DEBUG_TXT: boolean      = this.IS_BUILD ? false : false;
  public FLG_STATS: boolean          = this.IS_BUILD ? false : false;

  // パス
  public PATH_IMG: string = './assets/img/';

  // タッチデバイス
  public USE_TOUCH: boolean = Util.instance.isTouchDevice();

  // ブレイクポイント
  public BREAKPOINT: number = 768;

  // PSDサイズ
  public LG_PSD_WIDTH: number = 1600;
  public XS_PSD_WIDTH: number = 750;

  // 簡易版
  public IS_SIMPLE: boolean = Util.instance.isPc() && Util.instance.isSafari();

  // スマホ
  public IS_PC: boolean = Util.instance.isPc();
  public IS_SP: boolean = Util.instance.isSp();
  public IS_AND: boolean = Util.instance.isAod();
  public IS_TAB: boolean = Util.instance.isIPad();
  public USE_ROLLOVER:boolean = Util.instance.isPc() && !Util.instance.isIPad()

  public ITEM_NUM: number = 3;

  public COLOR:Array<Color> = [
    // new Color(0xf9fcfe),
    // new Color(0xe50044),
    // new Color(0xee7b00),
    // new Color(0xffe100),
    // new Color(0x00a161),
    new Color(0x0073b6),
    new Color(0x1c4fa1),
    new Color(0x673b93),
    new Color(0xd5eadd),
    new Color(0xf1f7e3),
    new Color(0xd9b983),
    new Color(0xd59f5e),
    new Color(0x6e5f59),
    new Color(0xe2cfbd),
    // new Color(0xa1807c),
    // new Color(0x0085cd),
    // new Color(0xfeda3e),
    // new Color(0xe73649),
  ]

  constructor() {}
  public static get instance(): Conf {
    if (!this._instance) {
      this._instance = new Conf();
    }
    return this._instance;
  }
}
