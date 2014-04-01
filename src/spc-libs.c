#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <snes_spc/spc.h>

SNES_SPC* snes_spc;
SPC_Filter* filter;
static int sample_count_;

void error( const char* str ) {
  if ( str ) {
    printf( "Error: %s\n", str );
  }
}

void SpcJsDestroy() {
  // printf( "SpcJsDestroy: start!\n");
  if (filter) {
    spc_filter_delete(filter);
  }
  if (snes_spc) {
    spc_delete(snes_spc);
  }
  // printf( "SpcJsDestroy: done!\n");
}

void SpcJsInit(unsigned char* spc, int spc_size) {
  // printf("SpcJsInit: start!\n");
  // printf("SPC Size: %d (C)\n", spc_size);
  if (!snes_spc) {
    snes_spc = spc_new();
  }
  if (!filter) {
    filter = spc_filter_new();
  }
  // Load SPC data into emulator
  error( spc_load_spc( snes_spc, spc, spc_size ) );
  // Debug: Output the current data as hex.
  // int i = 0;
  // while (i < 8) {
  //   printf("%02X\n", (unsigned char)spc[i]);
  //   i++;
  // }
  free(spc);
  // Most SPC files have garbage data in the echo buffer, so clear that.
  spc_clear_echo( snes_spc );
  // Clear filter before playing.
  spc_filter_clear( filter );
  sample_count_ = 0;
  // printf("SpcJsInit: done!\n");
}

int SpcJsDecodeAudio(short *outbuf, int buf_size) {
  // printf("SpcJsDecodeAudio: Start!\n");
  // printf("SpcJsDecodeAudio: Playing Samples...\n");
  error( spc_play( snes_spc, buf_size, outbuf ) );
  // printf("SpcJsDecodeAudio: Filtering Samples...\n");
  spc_filter_run( filter, outbuf, buf_size );
  sample_count_ += buf_size;
  // printf("SpcJsDecodeAudio: Done!\n");
  return sample_count_;
}
