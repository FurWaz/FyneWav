#include "render.h"
#include "midi.h"

// initialises OpenAL
bool initOpenAL()
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

// returns detected audio devices
void getDevices(std::vector<std::string>& Devices)
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

// free OpenAL resources
void shutdownOpenAL()
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

// fill the given buffer with 0
void emptyBuffer(ALuint buffer)
{
    ALshort* samples = (ALshort*) malloc( sizeof(ALshort) * FNV::BUFFER_SIZE );
    for (int i = 0; i < FNV::BUFFER_SIZE; i++)
        samples[i] = 0;
    
    alBufferData(buffer, AL_FORMAT_STEREO16, samples, FNV::BUFFER_SIZE * sizeof(ALshort), FNV::SAMPLERATE);

    if (alGetError() != AL_NO_ERROR)
        std::cerr << "ERROR: Cannot empty audioBuffer" << std::endl;
    delete samples;
}

// starts the audio engine
void startEngine()
{
    std::cout << "<=== starting audio engine ===>" << std::endl;

    initOpenAL();

    // setup audio source output
    alGenSources(1, &output);

    // setup audio buffers
    audioBuffers = (ALuint*) malloc( sizeof(ALuint) * FNV::NB_BUFFERS );
    alGenBuffers(FNV::NB_BUFFERS, audioBuffers);

    // fill audio buffers with 0
    for (short i = 0; i < FNV::NB_BUFFERS; i++)
        emptyBuffer(audioBuffers[i]);

    // queue buffers to play
    alSourceQueueBuffers(output, FNV::NB_BUFFERS, audioBuffers);
    
    // starts the main rendering thread
    startRender();

    portOpen(); // /!\ crash /!\ 
}

// stops the audio engine
void stopEngine()
{
    std::cout << "<=== stopping audio engine ===>" << std::endl;
    // stop the main rendering thread
    stopRender();

    alDeleteBuffers(FNV::NB_BUFFERS, audioBuffers);
    
    alSourcei(output, AL_BUFFER, 0);
    alDeleteSources(1, &output);

    delete audioBuffers;
    shutdownOpenAL();
    portClose(); // /!\ crash /!\ 
}