#include <iostream>
#include <vector>
#include <string.h>
#include <AL/al.h>
#include <AL/alc.h>
#include <math.h>
#include <thread>

bool InitOpenAL()
{
    // Ouverture du device
    ALCdevice* Device = alcOpenDevice(NULL);
    if (!Device)
        return false;
 
    // Création du contexte
    ALCcontext* Context = alcCreateContext(Device, NULL);
    if (!Context)
        return false;
 
    // Activation du contexte
    if (!alcMakeContextCurrent(Context))
        return false;
 
    return true;
}

void GetDevices(std::vector<std::string>& Devices)
{
    // Vidage de la liste
    Devices.clear();
 
    // Récupération des devices disponibles
    const ALCchar* DeviceList = alcGetString(NULL, ALC_DEVICE_SPECIFIER);
 
    if (DeviceList)
    {
        // Extraction des devices contenus dans la chaîne renvoyée
        while (strlen(DeviceList) > 0)
        {
            Devices.push_back(DeviceList);
            DeviceList += strlen(DeviceList) + 1;
        }
    }
}

void ShutdownOpenAL()
{
    // Récupération du contexte et du device
    ALCcontext* Context = alcGetCurrentContext();
    ALCdevice*  Device  = alcGetContextsDevice(Context);
 
    // Désactivation du contexte
    alcMakeContextCurrent(NULL);
 
    // Destruction du contexte
    alcDestroyContext(Context);
 
    // Fermeture du device
    alcCloseDevice(Device);
}
double test1 = 0;
double test2 = 0;
void genBuffer(int freq, ALuint buffer)
{
    int sampleRate = 44100;
    int nbchannels = 2;
    float nbSec = 0.1;
    int nbSamples = nbSec*sampleRate*nbchannels;
    ALshort samples[8820];
    int nbLoop = nbSamples/nbchannels;
    for (int i = 0; i < nbLoop; i++)
    {
        samples[i*nbchannels] = (ALshort) (sin(test1) * abs(sin(test2)) * 32767);
        samples[i*nbchannels+1] = (ALshort) (sin(test1) * abs(cos(test2)) * 32767);
        test1 += freq/(double)nbLoop;
        test2 += 0.00001;
    }
    
    alBufferData(buffer, AL_FORMAT_STEREO16, samples, nbSamples * sizeof(ALshort), nbSamples);
    if (alGetError() != AL_NO_ERROR)
        std::cout << "ERRORS" << std::endl;
}

int freq = 200;
bool stop = false;

void launch() {
    std::cout << "UwU" << std::endl;

    InitOpenAL();

    ALuint source;
    alGenSources(1, &source);

    ALenum Format = AL_FORMAT_STEREO16;
    
    int nbBuffers = 2;
    ALuint buffers[2];
    alGenBuffers(nbBuffers, buffers);
    for (int i = 0; i < nbBuffers; i++) {
        genBuffer(freq, buffers[i]);
    }

    alSourceQueueBuffers(source, nbBuffers, buffers);
    alSourcePlay(source);
    ALint processed = 0;
    while (!stop)
    {
        std::cout << "waiting" << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
        alGetSourcei(source, AL_BUFFERS_PROCESSED, &processed);
        while (processed--)
        {
            std::cout << "processing: " << processed << std::endl;
            ALuint buffer;
            alSourceUnqueueBuffers(source, 1, &buffer);
            genBuffer(freq, buffer);
            alSourceQueueBuffers(source, 1, &buffer);
        }
    }    

    alDeleteBuffers(2, buffers);
    
    alSourcei(source, AL_BUFFER, 0);
    alDeleteSources(1, &source);

    ShutdownOpenAL();
    return;
}

std::thread core;

int main()
{
    core = std::thread(launch);
}

int stoppage() {
    stop = true;
    core.join();
}