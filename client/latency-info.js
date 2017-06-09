class LatencyInfo {
  constructor() {
    this.latency = 0;
    this.abandonedBugs = [];
    this.latencyPerBug = [];
    this.multipleOutstanding = [];
    this.multipleLatency = 0;
  }
}