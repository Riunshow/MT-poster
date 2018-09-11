export function background(res) {
  //
  const bg1 = PIXI.Sprite.fromImage(res['./bg1.jpg'].url)

  // 初始化
  const app = new PIXI.Application(window.innerWidth, window.innerHeight / 1.5, {backgroundColor: 0xEEEEE})

  // 缩放比
  const scaleWidth = window.innerWidth / bg1.width
  const scaleHeight = window.innerHeight / 1.5 / bg1.height

  document.body.appendChild(app.view)

  bg1.scale.set(scaleWidth, scaleHeight)

  app.stage.interactive = true

  // 添加背景图片
  // app.stage.addChild(bg1)



  // 引入图片
  const texture = PIXI.Texture.fromImage(require('./../../../assets/male.png'))
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

  // 创建人物图片
  createBunny(app.screen.width * 0.5, app.screen.height * 0.5)

  function createBunny(x, y) {
    // 创建整体个容器
    const container = new PIXI.Container()

    // 创建人物容器
    const picContainer = new PIXI.Container()




    // 创建人物图片
    const bunny = new PIXI.Sprite(texture)
    bunny.interactive = true
    bunny.buttonMode = true
    bunny.anchor.set(0.5)
    bunny.scale.set(0.5 * scaleWidth, 0.5 * scaleHeight)

    bunny.height = 400 * scaleWidth
    bunny.width = 200 * scaleHeight

    bindMoveListener(bunny, container)

    picContainer.addChild(bunny)

    container.addChild(picContainer)

    container.x = x
    container.y = y

    // 创建外边框
    const border = new PIXI.Graphics()

    const paddingWidth = 30 * scaleWidth
    const paddingHeight = 30 * scaleHeight

    const borderWidth = container.width + paddingWidth * 2
    const borderHeight = container.height + paddingHeight * 2

    const borderX = 0 - borderWidth / 2
    const borderY = 0 - borderHeight / 2

    border.lineStyle(2, 0x000000, 1)
    border.drawRect(borderX, borderY, borderWidth, borderHeight)

    border.interactive = true;
    bindMoveListener(border, container)

    container.addChild(border)
    container.border = border

    // 创建遮罩层
    const handler = new PIXI.Graphics()
    handler.beginFill(0xffFF00, 0.1)
    handler.drawRect(borderX, borderY, borderWidth, borderHeight);
    handler.endFill();

    handler.interactive = true;
    bindMoveListener(handler, container)

    container.addChild(handler)
    container.handler = handler;

    // closeButton
    const closeButtonTexture = PIXI.Texture.fromImage(require('./../../../assets/close.png'))
    closeButtonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

    const closeButton = new PIXI.Sprite(closeButtonTexture)
    closeButton.anchor.set(0.5);
    closeButton.x = - container.width / 2
    closeButton.y = - container.height / 2
    closeButton.width = 56;
    closeButton.height = 56;
    container.addChild(closeButton);
    container.closeButton = closeButton;
    // bindRemoveListener(closeButton, container, focusCB);

    // resizeButton
    const resizeButtonTexture = PIXI.Texture.fromImage(require('./../../../assets/resize.png'))
    resizeButtonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

    const resizeButton = new PIXI.Sprite(resizeButtonTexture)
    resizeButton.anchor.set(0.75);
    resizeButton.x = container.width / 2
    resizeButton.y = container.height / 2
    resizeButton.width = 56;
    resizeButton.height = 56;
    container.addChild(resizeButton);
    container.resizeButton = resizeButton;

    bindResizeListener(resizeButton, picContainer);


    app.stage.addChild(container)

    // 绑定移动事件
    function bindMoveListener(trigger, target) {
      trigger.interactive = true;
      trigger
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

      function onDragStart(event) {
        if (!this.dragging) {
          this.data = event.data;
          this.dragging = true;
          // scale board
          // target.board.setAnimationState('grow');

          this.dragPoint = this.data.getLocalPosition(target.parent);
          this.dragPoint.x -= target.x;
          this.dragPoint.y -= target.y;
          // target.showPanel();
        }
      }

      function onDragEnd() {
        if (this.dragging) {
          this.dragging = false;
          // scale board
          // target.board.setAnimationState('shrink');

          this.data = null;
        }
      }

      function onDragMove() {
        if (this.dragging) {
          const newPosition = this.data.getLocalPosition(target.parent);
          target.x = newPosition.x - this.dragPoint.x;
          target.y = newPosition.y - this.dragPoint.y;
        }
      }
    }

    function bindResizeListener(trigger, target) {
      trigger.interactive = true;
      trigger
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

      function onDragStart(event) {
        if (!this.dragging) {
          this.data = event.data;
          this.dragging = true;

          this.dragPoint = this.data.getLocalPosition(target.parent);
          this.dragPoint.x -= target.x;
          this.dragPoint.y -= target.y;
        }
      }

      function onDragEnd() {
        if (this.dragging) {
          this.dragging = false;
          this.data = null;
        }
      }

      function onDragMove() {
        if (this.dragging) {
          const newPosition = this.data.getLocalPosition(target.parent);

          const ratio = target.width / target.height;

          console.log(target.height,  newPosition.y * 2);

          const newHeight = (newPosition.y - paddingHeight) * 2;
          const newWidth = newHeight * ratio;

          if (Math.min(newHeight, newWidth) > 200) {
            target.width = newWidth;
            target.height = newHeight;

            // registerAnimation(target, [{ prop: 'width' }, { prop: 'height' }]);
          }
        }
      }
    }

  }
}
