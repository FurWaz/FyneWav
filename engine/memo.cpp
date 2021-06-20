#include <node.h>

namespace fynewav
{

    void returnNumber(const v8::FunctionCallbackInfo<v8::Value> &args)
    {
        v8::Isolate *isolate = args.GetIsolate();
        auto total = v8::Number::New(isolate, 3+5);
        args.GetReturnValue().Set(total);
    }

    void returnString(const v8::FunctionCallbackInfo<v8::Value> &args)
    {
        v8::Isolate* isolate = args.GetIsolate();
        v8::Local<v8::String> output = v8::String::NewFromUtf8(isolate, "Hello, world!").ToLocalChecked();
        args.GetReturnValue().Set(output);
    }

    void takesNumber(const v8::FunctionCallbackInfo<v8::Value> &args)
    {
        v8::Isolate* isolate = args.GetIsolate();
        double d;
        args[0]->NumberValue(isolate->GetCurrentContext()).To(&d);
        args.GetReturnValue().Set(true);
    }

    void takesString(const v8::FunctionCallbackInfo<v8::Value> &args)
    {
        v8::Isolate *isolate = args.GetIsolate();
        v8::String::Utf8Value str(isolate, args[0]);
        std::string path(*str);
        args.GetReturnValue().Set(true);
    }

    void Initialize(v8::Local<v8::Object> exports)
    {
        NODE_SET_METHOD(exports, "takesNumber", takesNumber);
    }
    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
} // namespace fynewav


/*
cmake .. -DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreadedDLL -DBUILD_SHARED_LIBS:BOOL=ON; cmake --build .
*/