mergeInto(LibraryManager.library, {
  SpcJsLoadedMetadata: function() {
    console.log('SpcJsLoadedMetadata()');
    SpcJsLoadedMetadataCallback();
  },

  SpcJsOutputAudioReady: function(data) {
    console.log('SpcJsOutputAudioReady()');
    SpcJsOutputAudioReadyCallback();
  },

  SpcJsOutputAudio: function(buffers, channels, sampleCount) {
    console.log('SpcJsOutputAudio()');
    SpcJsAudioCallback(buffers);
  }
});
