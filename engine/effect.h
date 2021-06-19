#include <iostream>
#include <AL/al.h>

#ifndef FYNEWAV_EFFECT
#define FYNEWAV_EFFECT

class Effect
{
private:
    
public:
    Effect()
    {

    }
    ~Effect()
    {

    }
    virtual void render(ALshort* buffer) = 0;
};

#endif