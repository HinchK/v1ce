import { requireNativeModule } from "expo-modules-core";
type V1CEWidgetDataModuleType = { setSnapshot(json: string): void; clearSnapshot(): void; };
export default requireNativeModule<V1CEWidgetDataModuleType>("V1CEWidgetData");