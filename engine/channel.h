#include "vst.h"
#include "effect.h"

#ifndef FYNEWAV_CHANNEL
#define FYNEWAV_CHANNEL

class Channel
{
private:
    Channel** channels;  int nbChannels;
    Vst** vsts;          int nbVsts;
    Effect** effects;    int nbEffects;
    int id = 0;
public:
    Channel(int id)
    {
        channels = (Channel**) malloc( sizeof(Channel*) * 0 );
        nbChannels = 0;
        vsts = (Vst**) malloc( sizeof(Vst*) * 0 );
        nbVsts = 0;
        effects = (Effect**) malloc( sizeof(Effect*) * 0 );
        nbEffects = 0;
        this->id = id;
    }
    ~Channel()
    {
        delete channels;
        delete vsts;
        delete effects;
    }

    int getID() {
        return this->id;
    }

    int addChannel(Channel* c) {
        Channel** newTab = (Channel**) malloc( sizeof(Channel*) * (nbChannels+1) );
        for (int i = 0; i < nbChannels; i++)
            newTab[i] = channels[i];
        newTab[nbChannels] = c;
        delete channels;
        channels = newTab;
        nbChannels++;
        return nbChannels-1;
    }

    void removeChannel(int index) {
        Channel** newTab = (Channel**) malloc( sizeof(Channel*) * (nbChannels-1) );
        int newTabIndex = 0;
        for (int i = 0; i < nbChannels; i++)
        {
            if (i == index) continue;
            newTab[newTabIndex] = channels[i];
            newTabIndex++;
        }
        delete channels;
        channels = newTab;
        nbChannels--;
    }

    int addVst(Vst* c) {
        Vst** newTab = (Vst**) malloc( sizeof(Vst*) * (nbVsts+1) );
        for (int i = 0; i < nbVsts; i++)
            newTab[i] = vsts[i];
        newTab[nbVsts] = c;
        delete vsts;
        vsts = newTab;
        nbVsts++;
        return nbVsts-1;
    }

    void removeVst(int index) {
        Vst** newTab = (Vst**) malloc( sizeof(Vst*) * (nbVsts-1) );
        int newTabIndex = 0;
        for (int i = 0; i < nbVsts; i++)
        {
            if (i == index) continue;
            newTab[newTabIndex] = vsts[i];
            newTabIndex++;
        }
        delete vsts;
        vsts = newTab;
        nbVsts--;
    }

    void render(ALshort* buffer)
    {
        // render all the linked channels
        for (int i = 0; i < nbChannels; i++)
        {
            ALshort* samples = (ALshort*) malloc( sizeof(ALshort) * FNV::BUFFER_SIZE );
            for (int i = 0; i < FNV::BUFFER_SIZE; i++) samples[i] = 0;
            channels[i]->render(samples);
            for (int j = 0; j < FNV::BUFFER_SIZE; j++)
                buffer[j] += samples[j];
            delete samples;
        }

        // render all the current VSTs
        for (int i = 0; i < nbVsts; i++)
        {
            ALshort* samples = (ALshort*) malloc( sizeof(ALshort) * FNV::BUFFER_SIZE );
            for (int i = 0; i < FNV::BUFFER_SIZE; i++) samples[i] = 0;
            vsts[i]->render(samples);
            for (int j = 0; j < FNV::BUFFER_SIZE; j++)
                buffer[j] += samples[j];
            delete samples;
        }

        // apply effects
        for (int i = 0; i < nbEffects; i++)
            effects[i]->render(buffer);
    }
};
#endif

Channel mainChannel(0);
Channel ghostChannel(-1);