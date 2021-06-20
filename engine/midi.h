#include <iostream>
#include <thread>
#include "portmidi.h"

#define MIDI_SYSEX 0xf0
#define MIDI_EOX 0xf7

int active = FALSE;
bool running = true;
std::thread midiThread;

PmStream *midi_in;

int thru_sysex_in_progress = FALSE;
int app_sysex_in_progress = FALSE;

void process_midi()
{
    while (running)
    {
        PmError result;
        PmEvent buffer;

        if (!active) continue;

        if (!app_sysex_in_progress) {
            do {
                result = Pm_Poll(midi_in);
                if (result) {
                    int status;
                    int rslt = Pm_Read(midi_in, &buffer, 1);
                    if (rslt == pmBufferOverflow) 
                        continue;

                    status = Pm_MessageStatus(buffer.message);
                    if (((status & 0x80) == 0) && !thru_sysex_in_progress) {
                        continue; /* sysex old data, ignore */
                    }

                    int i = Pm_MessageData1(buffer.message);
                    int i2 = Pm_MessageData2(buffer.message);
                    int s = Pm_MessageStatus(buffer.message);
                    printf("Note %d - Force %d - State %s\n", i, i2, (s==128)? "Off": "On");

                    /* sysex processing */
                    if (status == MIDI_SYSEX) thru_sysex_in_progress = TRUE;
                    else if ((status & 0xF8) != 0xF8) {
                        /* not MIDI_SYSEX and not real-time, so */
                        thru_sysex_in_progress = FALSE;
                    }
                    if (thru_sysex_in_progress && /* look for EOX */
                        (((buffer.message & 0xFF) == MIDI_EOX) ||
                        (((buffer.message >> 8) & 0xFF) == MIDI_EOX) ||
                        (((buffer.message >> 16) & 0xFF) == MIDI_EOX) ||
                        (((buffer.message >> 24) & 0xFF) == MIDI_EOX))) {
                        thru_sysex_in_progress = FALSE;
                    }
                    if (thru_sysex_in_progress)
                        std::cout << "sysex in progress" << std::endl;
                }
            } while (result);
        }
    }
}

void portOpen()
{
    const PmDeviceInfo *info;
    PmDeviceID id;

    PmError err =  Pm_Initialize();

    midiThread = std::thread(process_midi);
    
    id = Pm_GetDefaultInputDeviceID();
    info = Pm_GetDeviceInfo(id);
    
    if (info == nullptr)
    {
        std::cout << "No Midi device found" << std::endl;
        return;
    }
    printf("Opening input device %s %s\n", info->interf, info->name);
    
    Pm_OpenInput(&midi_in, id, NULL, 0, NULL, NULL);
    
    Pm_SetFilter(midi_in, PM_FILT_ACTIVE | PM_FILT_CLOCK);
    active = true;
    return;
}

void portClose()
{
    active = false;
    running = false;
    
    midiThread.join();

    Pm_Close(midi_in);
    Pm_Terminate();
}