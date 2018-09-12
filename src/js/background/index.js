export function background(res) {
  console.log(res)
  //
  const bg1 = PIXI.Sprite.fromImage(res['./bg1.jpg'].url)

  // 初始化
  const app = new PIXI.Application(window.innerWidth, window.innerHeight / 1.5, {
    backgroundColor: 0xEEEEE
  })

  // 背景缩放比
  const scaleWidth = app.view.width / bg1.width
  const scaleHeight = app.view.height / bg1.height

  document.body.appendChild(app.view)

  bg1.scale.set(scaleWidth, scaleHeight)
  bg1.anchor.set(0.5, 0);
  bg1.position.set(app.view.width / 2, 0);
  app.stage.interactive = true

  // 添加背景图片
  app.stage.addChild(bg1)



  // 引入图片
  const texture = PIXI.Texture.fromImage(res['./male.png'].url)
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

    const appRatio = app.view.width / app.view.height
    const imgRatio = bunny.width / bunny.height

    bunny.interactive = true
    bunny.buttonMode = true
    bunny.anchor.set(0.5)

    if (imgRatio >= appRatio) {
      bunny.width = app.view.width;
      bunny.height = app.view.width / imgRatio;
    } else if (imgRatio < appRatio) {
      bunny.height = app.view.height;
      bunny.width = app.view.height * imgRatio;
    }

    bunny.scale.set(0.75)

    bindMoveListener(bunny, container)

    picContainer.addChild(bunny)

    container.addChild(picContainer)

    container.x = x
    container.y = y

    const paddingWidth = 30 * scaleWidth
    const paddingHeight = 30 * scaleHeight

    // 创建外边框
    const border = new PIXI.Graphics();

    border.draw = function (width, height) {
      const lineColor = '0x000000';
      this.lineStyle(1.5, lineColor, 1);
      this.beginFill(0x0, 0);
      this.drawRect(0, 0, width, height);
      this.pivot.x = width / 2;
      this.pivot.y = height / 2;
      this.endFill();
    };

    border.interactive = true;
    bindMoveListener(border, container)

    container.addChild(border)
    container.border = border

    // 创建覆盖层
    const handler = new PIXI.Graphics();
    handler.draw = function (width, height) {
      this.beginFill(0xffFF00, 0.1);
      this.drawRect(0, 0, width, height);
      this.pivot.x = width / 2;
      this.pivot.y = height / 2;
      this.endFill();
    };

    handler.interactive = true;
    bindMoveListener(handler, container)

    container.addChild(handler)
    container.handler = handler;

    // closeButton
    const closeButtonTexture = PIXI.Texture.fromImage(require('./../../../assets/close.png'))
    closeButtonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

    const closeButton = new PIXI.Sprite(closeButtonTexture)
    closeButton.anchor.set(0.5);
    closeButton.x = -container.width / 2
    closeButton.y = -container.height / 2
    closeButton.width = 56;
    closeButton.height = 56;
    container.addChild(closeButton);
    container.closeButton = closeButton;
    bindRemoveListener(closeButton, picContainer);

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

    // 删除
    function bindRemoveListener(trigger, target) {
      trigger.interactive = true;
      const removeTarget = () => {
        target.parent.removeChild(target);
      };
      trigger.on('mousedown', removeTarget).on('touchstart', removeTarget);
    }

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

    // 绑定缩放事件
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

    // 根据容器尺寸进行调整
    function dynamicSize() {
      const width = picContainer.width + paddingWidth * 2;
      const height = picContainer.height + paddingHeight * 2;
      if (!border.width || !border.height) {
        border.draw(width, height);
      } else {
        border.width = width;
        border.height = height;
      }

      if (!handler.width || !border.height) {
        handler.draw(width, height);
      } else {
        handler.width = width;
        handler.height = height;
      }

      picContainer.hitArea = new PIXI.Rectangle(0, 0, width, height);
      closeButton.position.set(-width / 2, -height / 2);
      resizeButton.position.set(width / 2, height / 2);
    }

    // 循环执行,监听变化
    dynamicSize();
    const ticker = new PIXI.ticker.Ticker();
    ticker.stop();
    ticker.add(() => {
      dynamicSize();
    });
    ticker.start()
    container.ticker = ticker;

  }
}
