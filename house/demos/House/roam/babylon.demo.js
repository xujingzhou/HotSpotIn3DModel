var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BABYLON;
(function (BABYLON) {
    var DEMO;
    (function (DEMO) {
        // Size of Sponza.babylon scene is 29 MB approx.
        var SCENESIZE = 29.351353645324707;
        var ITEMSTOSTREAM = 78;
        var Trigger = (function () {
            function Trigger() {
            }
            Trigger.prototype.engage = function (effect) {
            };
            Trigger.prototype.disengage = function () {
            };
            return Trigger;
        })();
        DEMO.Trigger = Trigger;
        var Effect = (function () {
            function Effect() {
            }
            Effect.prototype.start = function () {
            };
            return Effect;
        })();
        DEMO.Effect = Effect;
        var Track = (function () {
            function Track() {
            }
            return Track;
        })();
        DEMO.Track = Track;
        var DemoConfiguration = (function () {
            function DemoConfiguration() {
                this.startCameraIndex = 0;
            }
            return DemoConfiguration;
        })();
        DEMO.DemoConfiguration = DemoConfiguration;
        var TimeTrigger = (function (_super) {
            __extends(TimeTrigger, _super);
            function TimeTrigger() {
                _super.apply(this, arguments);
            }
            TimeTrigger.prototype.engage = function (effect) {
                this.handler = setTimeout(function () {
                    effect.start();
                }, this.delay);
            };
            TimeTrigger.prototype.disengage = function () {
                clearTimeout(this.handler);
            };
            return TimeTrigger;
        })(Trigger);
        DEMO.TimeTrigger = TimeTrigger;
        var FadePostProcessEffect = (function (_super) {
            __extends(FadePostProcessEffect, _super);
            function FadePostProcessEffect() {
                _super.apply(this, arguments);
            }
            FadePostProcessEffect.prototype.start = function () {
                var _this = this;
                var engine = this.scene.getEngine();
                var camera;
                if (!this.currentCamera) {
                    camera = this.scene.cameras[0]; //this.cameraIndex];
                }
                else {
                    camera = this.currentCamera;
                }
                var postProcess = new BABYLON.PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
                var fadeLevel = 1.0;
                var startDate = Date.now();
                postProcess.onApply = function (effect) {
                    if (_this.toBlack) {
                        fadeLevel = Math.min(1.0, 1.0 - (Date.now() - startDate) / _this.duration);
                    }
                    else {
                        fadeLevel = Math.max(0, (Date.now() - startDate) / _this.duration);
                    }
                    effect.setFloat("fadeLevel", 1.0); //fadeLevel);
                };
                setTimeout(function () {
                    postProcess.dispose();
                }, this.duration);
            };
            return FadePostProcessEffect;
        })(Effect);
        DEMO.FadePostProcessEffect = FadePostProcessEffect;
        var SwitchCameraEffect = (function (_super) {
            __extends(SwitchCameraEffect, _super);
            function SwitchCameraEffect(scheduler) {
                _super.call(this);
                this.scheduler = scheduler;
            }
            SwitchCameraEffect.prototype.start = function () {
                this.scene.activeCamera = this.scene.cameras[0]; //[this.cameraIndex];
                if (this.attachControl) {
                    this.scene.activeCamera.attachControl(this.scene.getEngine().getRenderingCanvas());
                    this.scheduler.interactive = true;
                }
            };
            return SwitchCameraEffect;
        })(Effect);
        DEMO.SwitchCameraEffect = SwitchCameraEffect;
        var TextEffect = (function (_super) {
            __extends(TextEffect, _super);
            function TextEffect() {
                _super.apply(this, arguments);
            }
            TextEffect.prototype.start = function () {
                var _this = this;
                this._textElement = document.createElement("div");
                this.container.appendChild(this._textElement);
                this.container.style.alignItems = this.alignItems;
                this.container.style.justifyContent = this.justifyContent;
                this._textElement.style.textAlign = "center";
                this._textElement.style.fontFamily = this.font;
                this._textElement.style.fontStyle = this.fontStyle;
                this._textElement.style.fontWeight = this.fontWeight;
                this._textElement.style.fontSize = this.fontSize;
                this._textElement.style.color = this.color;
                this._textElement.style.opacity = this.enterOpacity.toString();
                this._textElement.style.transform = "scale(" + this.enterScaling + ") translate(" + this.enterTranslation + ")";
                this._textElement.style.transition = "all " + (this.enterDuration / 1000.0) + "s ease";
                this._textElement.innerHTML = this.text;
                setTimeout(function () {
                    _this._textElement.style.transform = "scale(" + _this.scaling + ") translate(" + _this.translation + ")";
                    _this._textElement.style.opacity = _this.opacity.toString();
                    setTimeout(function () { _this.exit(); }, _this.duration);
                }, 0);
            };
            TextEffect.prototype.exit = function () {
                var _this = this;
                this._textElement.style.transition = "all " + (this.exitDuration / 1000.0) + "s ease";
                this._textElement.style.opacity = this.exitOpacity.toString();
                this._textElement.style.transform = "scale(" + this.exitScaling + ") translate(" + this.exitTranslation + ")";
                setTimeout(function () {
                    _this.container.removeChild(_this._textElement);
                }, this.exitDuration);
            };
            return TextEffect;
        })(Effect);
        DEMO.TextEffect = TextEffect;
        var Scheduler = (function () {
            function Scheduler() {
                this.triggers = [];
                this._interactive = false;
            }
            Object.defineProperty(Scheduler.prototype, "interactive", {
                get: function () {
                    return this._interactive;
                },
                set: function (value) {
                    this._interactive = value;
                    if (this._interactive === true && this.onInteractive) {
                        this.onInteractive();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Scheduler.Parse = function (source, result) {
                for (var prop in source) {
                    if (!source.hasOwnProperty(prop)) {
                        continue;
                    }
                    result[prop] = source[prop];
                }
                return result;
            };
            Scheduler.prototype.run = function (configurationFile, engine, onload) {
                var _this = this;
                this.engine = engine;
                // Resize
                window.addEventListener("resize", function () {
                    engine.resize();
                });
                var canvas = engine.getRenderingCanvas();
                var div = document.createElement("div");
                this.div = div;
                canvas.parentElement.appendChild(div);
                div.style.position = "absolute";
                div.style.left = "5%";
                div.style.right = "5%";
                div.style.top = "5%";
                div.style.bottom = "5%";
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.justifyContent = "center";
                div.style.pointerEvents = "none";
                var textPercentage = document.getElementById("textPercentage");
                var loadingProgress = document.getElementById("loadingProgress");
                var backgroundImage = document.getElementById("backgroundImage");
                var progressContainer = document.getElementById("progressContainer");
                var streamingText = document.getElementById("streamingText");
                function updateProgressDisplay(percentageValue) {
                    backgroundImage.style.opacity = (percentageValue / 100).toString();
                    textPercentage.innerHTML = percentageValue.toFixed() + "%";
                    loadingProgress.value = percentageValue;
                }
                BABYLON.Tools.LoadFile(configurationFile, function (result) {
                    var configuration = JSON.parse(result);
                    _this.configuration = configuration;
                    // Load scene
					_this.scene = scene;
					scene.activeCamera = scene.cameras[0]; //[configuration.startCameraIndex];
					// Postprocesses
					BABYLON.Effect.ShadersStore["fadePixelShader"] =
						"precision highp float;" +
							"varying vec2 vUV;" +
							"uniform sampler2D textureSampler; " +
							"uniform float fadeLevel; " +
							"void main(void){" +
							"vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
							"baseColor.a = 1.0;" +
							"gl_FragColor = baseColor;" +
							"}";
					_this.restart();
                               
                });
            };
            Scheduler.prototype.restart = function () {
                this.scene.activeCamera = this.scene.cameras[0]; //this.configuration.startCameraIndex];
               
                if (this.scene.Animatables) {
                    for (var index = 0; index < this.scene.Animatables.length; index++) {
                        var animatable = this.scene.Animatables[index];
                        animatable.reset();
                    }
                }
                // tracks
                for (var index = 0; index < this.configuration.tracks.length; index++) {
                    var track = this.configuration.tracks[index];
                    for (var effectIndex = 0; effectIndex < track.effects.length; effectIndex++) {
                        var parsedEffect = track.effects[effectIndex];
                        var effect;
                        switch (parsedEffect.type) {
                            case "text":
                                effect = new TextEffect();
                                break;
                            case "switchCamera":
                                effect = new SwitchCameraEffect(this);
                                break;
                            case "fade":
                                effect = new FadePostProcessEffect();
                                break;
                        }
                        Scheduler.Parse(parsedEffect, effect);
                        effect.container = this.div;
                        effect.scene = this.scene;
                        var parsedTrigger = parsedEffect.trigger;
                        var trigger;
                        switch (parsedTrigger.type) {
                            case "time":
                                trigger = new TimeTrigger();
                                break;
                        }
                        Scheduler.Parse(parsedTrigger, trigger);
                        this.triggers.push(trigger);
                        trigger.engage(effect);
                    }
                }
            };
            Scheduler.prototype.stop = function () {
                for (var index = 0; index < this.triggers.length; index++) {
                    var trigger = this.triggers[index];
                    trigger.disengage();
                }
            };
            return Scheduler;
        })();
        DEMO.Scheduler = Scheduler;
    })(DEMO = BABYLON.DEMO || (BABYLON.DEMO = {}));
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=babylon.demo.js.map