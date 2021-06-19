#include <AL/alc.h>
#include <sndfile.h>
#include <thread>
#include <vector>
#include <string.h>
#include "FNV.h"
#include "channel.h"
#include "VSTs/playsound.h"
#include <sndfile.h>

ALuint output;
ALuint* audioBuffers;
ALenum format = AL_FORMAT_STEREO16;

std::thread audioRenderer;
bool rendering = false;
bool processing = false;

unsigned short mainVolume = 0;
unsigned short mainProcessor = 0;

PlaySound* systemSound = new PlaySound();

void getError()
{
    ALenum x = alGetError();
    if (x != AL_NO_ERROR)
    {
        std::string err;
        switch (x)
        {
        case AL_NO_ERROR: err = "AL_NO_ERROR"; break;
        case AL_INVALID_NAME: err = "AL_INVALID_NAME"; break;
        case AL_INVALID_ENUM: err = "AL_INVALID_ENUM"; break;
        case AL_INVALID_VALUE: err = "AL_INVALID_VALUE"; break;
        case AL_INVALID_OPERATION: err = "AL_INVALID_OPERATION"; break;
        case AL_OUT_OF_MEMORY: err = "AL_OUT_OF_MEMORY"; break;
        default:
            break;
        }
        std::cerr << "ERROR: Cannot render audioBuffer: " << err << std::endl;
    }
}

void mainRenderLoop()
{
    processing = true;
    int nbProcessed = 0;
    unsigned int bufferTime = (FNV::BUFFER_SIZE / (double)FNV::SAMPLERATE) * 1000; // in milliseconds
    alSourcePlay(output);
    while (rendering)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
        alGetSourcei(output, AL_BUFFERS_PROCESSED, &nbProcessed);
        while (nbProcessed--)
        {
            // unqueue the buffer
            ALuint buffer;
            alSourceUnqueueBuffers(output, 1, &buffer);

            // generate samples
            ALshort* samples = (ALshort*) malloc( sizeof(ALshort) * FNV::BUFFER_SIZE );
            for (int i = 0; i < FNV::BUFFER_SIZE; i++)
                samples[i] = 0;

            // render samples
            auto start = std::chrono::high_resolution_clock::now();
            mainChannel.render(samples);
            auto end = std::chrono::high_resolution_clock::now();
            
            // bind samples to buffer
            alBufferData(buffer, format, samples, FNV::BUFFER_SIZE * sizeof(ALshort), FNV::SAMPLERATE);

            // queue the new buffer
            alSourceQueueBuffers(output, 1, &buffer);

            // get the buffer volume
            double lvl = 0;
            for (int i = 0; i < FNV::BUFFER_SIZE; i++)
                lvl += abs(samples[i]);
            mainVolume = lvl / (double) FNV::BUFFER_SIZE / 80 / FNV::NB_CHANNELS;
            
            mainProcessor = std::chrono::duration_cast<std::chrono::milliseconds>(end-start).count() * 100 / bufferTime;
            delete samples;
        }
    }
    processing = false;
}

void startRender()
{
    rendering = true;
    audioRenderer = std::thread(mainRenderLoop);
    mainChannel.addChannel(&ghostChannel);
    ghostChannel.addVst(systemSound);
}

void stopRender()
{
    rendering = false;
    audioRenderer.join();
}