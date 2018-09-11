export function background(res) {
  //
  const bg1 = PIXI.Sprite.fromImage(res['./bg1.jpg'].url)

  // 初始化
  const app = new PIXI.Application(window.innerWidth, window.innerHeight / 1.5, {backgroundColor: 0xFFFFFF})

  // 缩放比
  const scaleWidth = window.innerWidth / bg1.width
  const scaleheight = window.innerHeight / 1.5 / bg1.height

  document.body.appendChild(app.view)

  bg1.scale.set(scaleWidth, scaleheight)

  app.stage.interactive = true

  // 添加背景图片
  // app.stage.addChild(bg1)

  // 创建一个容器
  const container = new PIXI.Container()

  // 引入图片
  const texture = PIXI.Texture.fromImage(require('./../../../assets/male.png'))
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

  // 创建人物图片
  createBunny(app.screen.width * 0.5, app.screen.height * 0.5)

  function createBunny(x, y) {
    // 创建人物图片
    const bunny = new PIXI.Sprite(texture)
    bunny.interactive = true
    bunny.buttonMode = true
    bunny.anchor.set(0.5)
    // bunny.scale.set(1)

    bunny.height = 300
    bunny.width = 150

    container.addChild(bunny)

    container.x = x
    container.y = y

    console.log(bunny.x, bunny.y, bunny.width, bunny.height)
    console.log(container.x, container.y, container.width, container.height)

    // border padding
    const PADDING = 100

    // border height width
    const borderWidth = container.width + PADDING * 2
    const borderHeight = container.height + PADDING * 2

    // 创建外边框
    const border = new PIXI.Graphics()
    const borderX = 0 - borderWidth / 2
    const borderY = 0 - borderHeight / 2

    // 边框设置
    border.lineStyle(2, 0x000000, 1)
    border.drawRect(borderX, borderY, borderWidth, borderHeight)

    container.addChild(border)
    // container.border = border

    // 创建遮罩层
    const handler = new PIXI.Graphics()
    handler.beginFill(0xffFF00, 0.1)
    handler.drawRect(borderX, borderY, borderWidth, borderHeight);
    handler.endFill();

    handler.interactive = true;

    container.addChild(handler)
    container.handler = handler;

    handler
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      // .on('pointermove', onDragMove)
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);
    // add to app
    app.stage.addChild(container)

    // app.stage.addChild(border)
    // app.stage.border = border

    function onDragStart(event) {
      this.data = event.data
      this.alpha = 0.5
      this.dragging = true
    }

    function onDragEnd() {
      this.alpha = 1
      this.dragging = false
      this.data = null
    }

    function onDragMove() {
      if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent)
        this.x = newPosition.x
        this.y = newPosition.y

        border.x = this.x
        border.y = this.y

        bunny.x = this.x
        bunny.y = this.y
      }
    }

  }
}
