declare module "@analytics/segment" {
  interface SegmentPluginOptions {
    writeKey: string;
    enabled: boolean;
  }
  export default function segmentPlugin(
    options: SegmentPluginOptions
  ): AnalyticsPlugin;
}
