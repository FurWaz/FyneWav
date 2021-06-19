#include <node.h>
#include "engine.h"

void _getVolume(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(mainVolume);
}

void _getProcessor(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(mainProcessor);
}

void _playSound(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();
    v8::String::Utf8Value str(isolate, args[0]);
    std::string path(*str);
    systemSound->loadSound(path);
    args.GetReturnValue().Set(true);
}

void _startEngine(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();
    startEngine();
    args.GetReturnValue().Set(true);
}

void _stopEngine(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();
    stopEngine();
    args.GetReturnValue().Set(true);
}

void Initialize(v8::Local<v8::Object> exports)
{
    NODE_SET_METHOD(exports, "playSound", _playSound);
    NODE_SET_METHOD(exports, "getVolume", _getVolume);
    NODE_SET_METHOD(exports, "getProcessor", _getProcessor);
    NODE_SET_METHOD(exports, "start", _startEngine);
    NODE_SET_METHOD(exports, "stop", _stopEngine);
}
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);