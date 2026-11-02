import {
  columnResizingFeature,
  columnSizingFeature,
  metaHelper,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table";

export type DeskTableColumnMeta = {
  /** Horizontal alignment of the column header and cells. */
  align?: "left" | "center" | "right";
};

export const deskTableFeatures = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  rowSelectionFeature,
  columnMeta: metaHelper<DeskTableColumnMeta>(),
});

export type DeskTableFeatures = typeof deskTableFeatures;
