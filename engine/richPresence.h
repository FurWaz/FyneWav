#include "Discord/discord.h"

discord::Core* core{};

class RichPresence
{
private:
    
public:
    RichPresence()
    {
        auto result = discord::Core::Create(787344585340223538, DiscordCreateFlags_Default, &core);
        discord::Activity act{};
        act.SetState("FyneWav");
        act.SetDetails("Project.fyn");
        core->ActivityManager().UpdateActivity(act, [](discord::Result result) {
            
        });
    }

    ~RichPresence()
    {
        
    }

    void update()
    {
        core->RunCallbacks();
    }
};

RichPresence* richPresence = new RichPresence();