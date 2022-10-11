import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { LineSegments } from 'three/src/objects/LineSegments';
import { Util } from "../libs/util";
import { Vector3 } from 'three/src/math/Vector3';
import { DoubleSide } from 'three/src/constants';
import { Conf } from '../core/conf';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
// import { MousePointer } from "../core/mousePointer";

export class Item extends MyObject3D {

  private _itemId:number;
  private _blocks:Array<any> = [];

  private _bgLine:LineSegments;
  private _bgFill:Mesh;

  private _cntInterval:number = 450;

  private _isRef:boolean;

  private _layer:number;

  public itemSize:Vector3 = new Vector3(300, 300, 0)
  public blockSize:Vector3 = new Vector3(30, 30, 0)

  constructor(opt:any = {}) {
    super()

    this._itemId = opt.id;
    this._c = opt.id * 10;
    this._isRef = opt.ref;
    this._layer = opt.layer;

    if(this._layer >= 1) {
      this._isRef = false;
    } else {
      this._isRef = true;
    }

    this._bgLine = new LineSegments(
      opt.geoEdge,
      opt.matLine
    )
    this.add(this._bgLine);
    // this._bgLine.visible = false;

    this._bgFill = new Mesh(
      opt.geoPlane,
      new MeshBasicMaterial({
        color: Util.instance.randomArr(Conf.instance.COLOR),
        transparent:true,
        depthTest:false,
        side:DoubleSide,
      })
    )
    this.add(this._bgFill);
    this._bgFill.visible = false;

    const num = 6
    for(let i = 0; i < num; i++) {
      let mesh
      if(this._isRef) {
        mesh = new Item({
          id:i,
          geoPlane:opt.geoPlane,
          geoEdge:opt.geoEdge,
          geoBox:opt.geoBox,
          matLine:opt.matLine,
          layer:this._layer + 1,
          ref:true,
        })
      } else {
        mesh = new Mesh(
          opt.geoBox,
          new MeshPhongMaterial({
            color:Util.instance.randomArr(Conf.instance.COLOR),
            emissive:Util.instance.randomArr(Conf.instance.COLOR),
            transparent:true,
            depthTest:false,
            side:DoubleSide,
          })
        );
      }

      this.add(mesh);
      this._blocks.push({
        mesh:mesh,
        cnt:~~((i / num) * this._cntInterval),
      });
    }
  }


  protected _update():void {
    super._update();

    const blockSize = this.blockSize.x * 0.5;

    const bgLineSize = this.itemSize.x * 1;
    this._bgLine.scale.set(bgLineSize, bgLineSize, 1)

    const bgFillSize = (bgLineSize - blockSize * 2);
    this._bgFill.scale.set(bgFillSize, bgFillSize, 1)

    const area = bgLineSize - blockSize;

    this._blocks.forEach((val) => {
      val.cnt++;
      const rate = (val.cnt % this._cntInterval) / this._cntInterval;
      // const rate = Util.instance.map(MousePointer.instance.easeNormal.x, 0, 1, -1, 1);

      const mesh = val.mesh;

      if(this._isRef) {
        mesh.itemSize.set(blockSize, blockSize, blockSize);
        mesh.blockSize.set(blockSize * 0.5, blockSize * 0.5, blockSize * 0.5);
      } else {
        mesh.scale.set(blockSize * 1, blockSize * 1, blockSize * 1);
      }

      if(rate < 0.25) {
        mesh.position.x = Util.instance.map(rate, -area * 0.5, area * 0.5, 0, 0.25);
        mesh.position.y = -area * 0.5;
        mesh.rotation.x = 0;
        mesh.rotation.y = Util.instance.radian(Util.instance.map(rate, 0, 90, 0, 0.25));
      }

      if(rate >= 0.25 && rate < 0.5) {
        mesh.position.x = area * 0.5;
        mesh.position.y = Util.instance.map(rate, -area * 0.5, area * 0.5, 0.25, 0.5);
        mesh.rotation.x = Util.instance.radian(Util.instance.map(rate, 90, 0, 0.25, 0.5));
        mesh.rotation.y = 0;
      }

      if(rate >= 0.5 && rate < 0.75) {
        mesh.position.x = Util.instance.map(rate, area * 0.5, -area * 0.5, 0.5, 0.75);
        mesh.position.y = area * 0.5;
        mesh.rotation.x = 0;
        mesh.rotation.y = Util.instance.radian(Util.instance.map(rate, 90, 0, 0.5, 0.75));
      }

      if(rate >= 0.75 && rate < 1) {
        mesh.position.x = -area * 0.5
        mesh.position.y = Util.instance.map(rate, area * 0.5, -area * 0.5, 0.75, 1);
        mesh.rotation.x = Util.instance.radian(Util.instance.map(rate, 0, 90, 0.75, 1));
        mesh.rotation.y = 0;
      }

      if(this._itemId % 2 == 0) {
        mesh.position.x *= -1;
      }

      if(this._isRef) {
        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
      }
    })
  }


  protected _resize(): void {
    super._resize();
  }
}