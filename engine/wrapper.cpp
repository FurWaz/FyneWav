#include <node.h>
#include <AL/al.h>
#include <AL/alc.h>
#include "test.h"

namespace fynewav
{
    using v8::Boolean;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    std::string function() {
        ALCdevice *device;
        device = alcOpenDevice(NULL);
        if (!device)
                return std::string("No devices found");
        return std::string("Device found");
    }

    void DemoFunction(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();
        auto total = Number::New(isolate, 3+5);
        args.GetReturnValue().Set(total);
    }

    void uwu(const FunctionCallbackInfo<Value> &args)
    {
        Isolate* isolate = args.GetIsolate();
        Local<String> output = String::NewFromUtf8(isolate, function().c_str()).ToLocalChecked();
        args.GetReturnValue().Set(output);
    }

    void OpenAl(const FunctionCallbackInfo<Value> &args)
    {
        Isolate* isolate = args.GetIsolate();
        main();
        args.GetReturnValue().Set(true);
    }

    void SetFreq(const FunctionCallbackInfo<Value> &args)
    {
        Isolate* isolate = args.GetIsolate();
        double d;
        args[0]->NumberValue(isolate->GetCurrentContext()).To(&d);
        freq = std::round(d);
        args.GetReturnValue().Set(true);
    }

    void Stop(const FunctionCallbackInfo<Value> &args)
    {
        Isolate* isolate = args.GetIsolate();
        stoppage();
        args.GetReturnValue().Set(true);
    }

    void Initialize(Local<Object> exports)
    {
        NODE_SET_METHOD(exports, "checkDevices", uwu);
        NODE_SET_METHOD(exports, "openAl", OpenAl);
        NODE_SET_METHOD(exports, "setFreq", SetFreq);
        NODE_SET_METHOD(exports, "stop", Stop);
    }
    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
} // namespace fynewav