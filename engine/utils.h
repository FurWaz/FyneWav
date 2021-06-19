#include <AL/al.h>

class StereoSample
{
public:
    ALshort left;
    ALshort right;
    StereoSample() {
        this->left = 0;
        this->right = 0;
    }
    StereoSample(ALshort left, ALshort right) {
        this->left = left;
        this->right = right;
    }
    ~StereoSample() {

    }
};