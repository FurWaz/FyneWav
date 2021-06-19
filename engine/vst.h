#include <iostream>
#include <AL/al.h>

#ifndef FYNEWAV_VST
#define FYNEWAV_VST

class Vst
{
private:
    
public:
    Vst()
    {

    }
    ~Vst()
    {

    }
    virtual void render(ALshort* buffer) = 0;
};

#endif