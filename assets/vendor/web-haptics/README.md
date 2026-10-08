# WebHaptics 0.0.6

Pinned ES module distribution from the `web-haptics` npm package, vendored locally
so this static site needs no runtime package manager or third-party script host.

- Upstream: https://github.com/lochie/web-haptics
- Package: https://www.npmjs.com/package/web-haptics/v/0.0.6
- License: MIT, included alongside the original distribution files.
- `index.mjs` imports `chunk-4NSAIXAB.mjs`; both remain unmodified.

The companion dynamically imports this module on touch devices. Feedback requires
a trusted user interaction, is disabled for reduced motion and hidden documents,
and has a 650 ms tap cooldown and 14 s ambient cooldown. Ambient feedback occurs
once per curated arrival, never on scroll ticks or footsteps. Debug audio and the
visible test switch are disabled. Hardware/browser support determines whether a
pulse is physically felt; unsupported devices retain the visual interactions.
