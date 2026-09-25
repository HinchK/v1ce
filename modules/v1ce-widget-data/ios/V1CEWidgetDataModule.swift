import ExpoModulesCore
import WidgetKit
public class V1CEWidgetDataModule: Module {
  public func definition() -> ModuleDefinition {
    Name("V1CEWidgetData")
    Function("setSnapshot") { (json: String) in
      guard let data = json.data(using: .utf8) else { return }
      UserDefaults(suiteName: "group.app.v1ce")?.set(data, forKey: "v1ce_widget_profile_v1")
      WidgetCenter.shared.reloadAllTimelines()
    }
    Function("clearSnapshot") {
      UserDefaults(suiteName: "group.app.v1ce")?.removeObject(forKey: "v1ce_widget_profile_v1")
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}