import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { Conf } from "../core/conf";
import { Util } from "../libs/util";
import { MousePointer } from "../core/mousePointer";
import { Item } from './item';
import { HSL } from '../libs/hsl';
import { Color } from 'three/src/math/Color';
// import { Mesh } from 'three/src/objects/Mesh';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { EdgesGeometry } from 'three/src/geometries/EdgesGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial';
import { DoubleSide } from 'three/src/constants';
import { Capture } from '../webgl/capture';
import { ImgMesh } from '../webgl/imgMesh';
import { Param } from '../core/param';
// import { TexLoader } from '../webgl/texLoader';

export class Visual extends Canvas {

  private _baseCap:Capture;
  private _con:Object3D;
  private _item:Array<Item> = [];
  private _bgColor:Color = new Color();
  private _destCon:Object3D;
  private _dest:Array<ImgMesh> = [];
  private _title:Array<ImgMesh> = [];

  constructor(opt: any) {
    super(opt);

    Param.instance;

    // 描画用シーン
    this._baseCap = new Capture();

    // ライト
    const light = new DirectionalLight(Util.instance.randomArr(Conf.instance.COLOR), 1);
    this._baseCap.add(light)
    light.position.set(100, 100, 100);

    // 背景の色
    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    // hsl.s *= 0.1;
    hsl.l *= 0.1;
    col.setHSL(hsl.h, hsl.s, hsl.l);
    this._bgColor = col;

    this._con = new Object3D();
    this._baseCap.add(this._con);

    // ジオメトリ作っておく
    const geoPlane = new PlaneGeometry(1,1);
    const geoEdge = new EdgesGeometry(geoPlane);
    const geoBox = new BoxGeometry(1,1,1);

    const matLine = new LineBasicMaterial({
      color:0xffffff,
      transparent:true,
      depthTest:false,
      side:DoubleSide,
      opacity:0.25,
    })

    for(let i = 0; i < Conf.instance.ITEM_NUM; i++) {
      const item = new Item({
        id:i,
        geoPlane:geoPlane,
        geoEdge:geoEdge,
        geoBox:geoBox,
        matLine:matLine,
        ref:true,
        layer:0,
      })
      this._con.add(item);
      this._item.push(item);
    }

    this._destCon = new Object3D();


    // 出力用
    this.mainScene.add(this._destCon);
    const num = 30;
    for(let i = 0; i < num; i++) {
      const dest = new ImgMesh({
        tex:this._baseCap.texture()
      });
      this._destCon.add(dest);
      this._dest.push(dest);

      if(i != num - 1) {
        dest.getUni().bright.value = -0.5;
        dest.getUni().contrast.value = 0.5;
      }
    }


    // タイトル
    // for(let i = 0; i < 3; i++) {
    //   const title = new ImgMesh({
    //     tex:TexLoader.instance.get(Conf.instance.PATH_IMG + 'tex-title.png')
    //   });
    //   this._destCon.add(title);
    //   this._title.push(title);
    // }

    this._resize()
  }


  protected _update(): void {
    super._update()

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    this._destCon.position.y = Func.instance.screenOffsetY() * -1;

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    let itemSizeOld = sw * 0.5 * Util.instance.map(my, 0.5, 1.5, -1, 1);
    // let itemSizeOld = sw * 0.5 * 3.5;
    let itemSize = itemSizeOld;
    // const startItemSize = itemSize;
    this._item.forEach((val) => {
      val.itemSize.set(itemSize, itemSize, 1);
      // val.position.z = i;
      // val.position.x = itemSizeOld * 0.5;
      // val.position.y = itemSizeOld * 0.5;

      // if(i != 0) {
      //   val.position.x = itemSizeOld * 0.5;
      //   val.position.y = itemSizeOld * 0.5;
      // }

      // val.position.x = (itemSize - startItemSize) * 0.5;
      // val.position.y = (itemSize - startItemSize) * 0.5;

      // if(i % 2 == 0) {
      //   val.position.x *= -1;
      //   val.position.y *= -1;
      // }

      itemSizeOld = itemSize;
      itemSize *= Util.instance.map(mx, 0.5, 0.75, -1, 1);
      // itemSize *= 0.15;
      // itemSize *= 0.9

      val.blockSize.x = itemSizeOld - itemSize;
    });

    const kake = 1;
    this._dest.forEach((val,i) => {
      val.scale.set(sw, sh, 1);
      val.position.x = i * kake;
      val.position.y = i * kake;
    })

    // タイトル
    this._title.forEach((val,i) => {
      // const rad = Util.instance.radian((360 / this._title.length) * i);
      // const radius = sw * 0.1;
      const ttlSize = sw * 0.15;
      const total = ttlSize * this._title.length;
      val.setSize(ttlSize);
      val.position.x = ttlSize * i - (total * 0.5);
      val.position.y = 0;
      if(i % 2 == 0) {
        val.scale.x = -1;
      }
      // val.position.y = i * 1;
      // val.position.x = i * 1;
    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0xffffff, 0);
    this._baseCap.render(this.renderer, this.cameraOrth);

    this.renderer.setClearColor(this._bgColor, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 2 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();
    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._baseCap.setSize(w, h, pixelRatio);



    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
