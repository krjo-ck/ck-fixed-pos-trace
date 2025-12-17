# ck-fixed-pos-trace

A CanKing GUI extension with a custom fixed position trace

## Introduction

This is a Kvaser CanKing extension showing a custom fixed position trace.

This project shows how to create a simple extension. It is using the
```CanChannelSelectControl``` for selecting a CanKing channel and a Material-UI
Table component for showing the data.

It also uses the useFixedPositionModeMeasurementData hook to subscribe on fixed position frame data.

If you want a scrolling trace instead, then you should use the useScrollModeMeasurementData hook instead. Or combine the hooks if you need a trace supporting both fixed position and scrolling mode.

## Installation

If you want to run this extension inside CanKing then follow these steps:

1. Download the ck-fixed-pos-trace-1.0.0.tgz file from the v1.0.0 release
2. Start CanKing and select ```More->Extensions->Install...```
3. Select the file and click Open

The 'Fixed Position Trace (krjo-ck)' view will now be available inside CanKing.
