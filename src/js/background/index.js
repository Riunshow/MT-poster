export function background(res) {
  //
  const bg1 = PIXI.Sprite.fromImage(res['./bg1.jpg'].url)

  // 初始化
  const app = new PIXI.Application(window.innerWidth, window.innerHeight / 1.5)

  // 缩放比
  const scaleWidth = window.innerWidth / bg1.width
  const scaleheight = window.innerHeight / bg1.height

  document.body.appendChild(app.view);

  bg1.scale.set(scaleWidth, scaleheight)

  app.stage.interactive = true

  // 添加背景图片
  app.stage.addChild(bg1);




  // create a texture from an image path
  var texture = PIXI.Texture.fromImage('https://pixijs.io/examples/required/assets/bunny.png');

  // Scale mode for pixelation
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  createBunny(app.screen.width * 0.5, app.screen.height * 0.5);

  function createBunny(x, y) {

    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
  }

  function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  function onDragMove() {
    if (this.dragging) {
      var newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

}
