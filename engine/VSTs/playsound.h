#include "../vst.h"
#include "../FNV.h"
#include <sndfile.h>

#ifndef FYNEWAV_PLAYSOUND
#define FYNEWAV_PLAYSOUND

class PlaySound : public virtual Vst
{
private:
    std::string path;
    int readingIndex;
    ALshort* data;
    int length;
public:
    PlaySound()
    {
        this->data = (ALshort*) malloc( sizeof(ALshort) );
    }
    ~PlaySound()
    {
        delete this->data;
    }

    void loadSound(std::string path) {
        SF_INFO info;
        SNDFILE* file = sf_open(path.c_str(), SFM_READ, &info);
        if (!file)
        {
            std::cout << "ERROR: Cannot read audio file" << std::endl;
            return;
        }

        if (info.samplerate == FNV::SAMPLERATE) // same sampleRate: don't change it
        {
            this->length = (info.frames*info.channels);
            delete this->data;
            this->data = (ALshort*) malloc( sizeof(ALshort) * this->length );

            sf_read_short(file, data, this->length);
            sf_close(file);
        } else // re adjust the sampleRate
        {
            int l = (info.frames*info.channels);
            ALshort* song = (ALshort*) malloc( sizeof(ALshort) * l );

            sf_read_short(file, song, l);
            sf_close(file);

            this->length = l * (FNV::SAMPLERATE*2 / (double)(info.samplerate*info.channels));
            delete this->data;
            this->data = (ALshort*) malloc( sizeof(ALshort) * this->length );


            double ratio = (info.samplerate / (double)FNV::SAMPLERATE);
            if (info.channels == FNV::NB_CHANNELS)
            {
                for (int i = 0; i < this->length/2; i++)
                {
                    double songProgress = i * ratio;
                    double shiftAmount = songProgress - std::floor(songProgress);
                    int songIndex = (int) songProgress*2;
                    ALshort right_min = song[songIndex];
                    ALshort left_min = song[songIndex+1];
                    ALshort right_max = song[songIndex+2];
                    ALshort left_max = song[songIndex+3];
                    
                    this->data[i*2] = right_max * shiftAmount + right_min * (1-shiftAmount);
                    this->data[i*2+1] = left_max * shiftAmount + left_min * (1-shiftAmount);
                }
            } else
            {
                for (int i = 0; i < this->length/2; i++)
                {
                    double songProgress = i * ratio;
                    double shiftAmount = songProgress - std::floor(songProgress);
                    int songIndex = (int) songProgress;
                    ALshort min = song[songIndex];
                    ALshort max = song[songIndex+1];
                    
                    this->data[i*2] = max * shiftAmount + min * (1-shiftAmount);
                    this->data[i*2+1] = this->data[i*2];
                }
            }

            delete song;
        }
        
        this->readingIndex = 0;
    }

    void render(ALshort* buffer)
    {
        for (int i = 0; i < FNV::BUFFER_SIZE; i++)
        {
            if (this->readingIndex >= this->length) buffer[i] = 0;
            else buffer[i] = this->data[this->readingIndex++];
        }
    }
};

#endif