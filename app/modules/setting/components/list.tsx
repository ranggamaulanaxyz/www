import type { SettingSchema } from "../schemas";
import SettingTableView from "./table";

interface SettingListViewProps {
  settings: SettingSchema[];
}
export default function SettingListView({ settings }: SettingListViewProps) {
  return (
    <div className="p-4">
      <SettingTableView settings={settings} />
    </div>
  );
}
