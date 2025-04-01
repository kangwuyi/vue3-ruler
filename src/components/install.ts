import { type App } from 'vue'
import SketchRuler from './index.vue'
SketchRuler.install = function (app: App) {
  app.component('imp-sketch-ruler', SketchRuler)
}
export default SketchRuler
